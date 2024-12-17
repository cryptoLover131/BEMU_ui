import { Currency, CurrencyAmount, ERC20Token } from 'libraries/swap-sdk'
import { MaxUint256 } from 'libraries/swap-sdk-core'
import { useToast } from 'contexts'
import isUndefinedOrNull from 'utils/isUndefinedOrNull'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { calculateGasMargin } from 'utils'
import { getViemErrorMessage } from 'utils/errors'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { useHasPendingApproval, useTransactionAdder } from 'state/transactions/hooks'
import { useCallWithGasPrice } from './useCallWithGasPrice'
import { useTokenContract } from './useContracts'
import useTokenAllowance from './useTokenAllowance'

export enum ApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  APPROVED,
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useApproveCallback(
  amountToApprove?: CurrencyAmount<Currency> | null,
  spender?: string,
  options: {
    addToTransaction
    targetAmount?: bigint
  } = {
    addToTransaction: true,
  },
) {
  const { addToTransaction = true, targetAmount } = options
  const { address: account } = useAccount()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { toastError } = useToast()
  const token = amountToApprove?.currency?.isToken ? amountToApprove.currency : undefined
  const { allowance: currentAllowance, refetch } = useTokenAllowance(token, account ?? undefined, spender)
  const pendingApproval = useHasPendingApproval(token?.address, spender)
  const [pending, setPending] = useState<boolean>(pendingApproval)
  const [isPendingError, setIsPendingError] = useState<boolean>(false)

  useEffect(() => {
    if (pendingApproval) {
      setPending(true)
    } else if (pending) {
      refetch().then(() => {
        setPending(false)
      })
    }
  }, [pendingApproval, pending, refetch])

  // check the current approval status
  const approvalState: ApprovalState = useMemo(() => {
    if (!amountToApprove || !spender) return ApprovalState.UNKNOWN
    if (amountToApprove.currency?.isNative) return ApprovalState.APPROVED
    // we might not have enough data to know whether or not we need to approve
    if (!currentAllowance) return ApprovalState.UNKNOWN

    // amountToApprove will be defined if currentAllowance is
    return currentAllowance.lessThan(amountToApprove)
      ? pending
        ? ApprovalState.PENDING
        : ApprovalState.NOT_APPROVED
      : ApprovalState.APPROVED
  }, [amountToApprove, currentAllowance, pending, spender])

  const tokenContract = useTokenContract(token?.address)
  const addTransaction = useTransactionAdder()

  const approve = useCallback(
    async (overrideAmountApprove?: bigint, alreadyApproved = approvalState !== ApprovalState.NOT_APPROVED) => {
      if (alreadyApproved && isUndefinedOrNull(overrideAmountApprove)) {
        toastError('Error', 'Approve was called unnecessarily')
        console.error('approve was called unnecessarily')
        setIsPendingError(true)
        return undefined
      }
      if (!token) {
        // toastError(t('Error'), t('No token'))
        console.error('no token')
        // return undefined
      }

      if (!tokenContract) {
        toastError('Error', `Cannot find contract of the token ${token?.address ?? ""}`)
        console.error('tokenContract is null')
        setIsPendingError(true)
        return undefined
      }

      if (!amountToApprove && isUndefinedOrNull(overrideAmountApprove)) {
        toastError('Error', 'Missing amount to approve')
        console.error('missing amount to approve')
        setIsPendingError(true)
        return undefined
      }

      if (!spender) {
        toastError('Error', 'No spender')
        console.error('no spender')
        setIsPendingError(true)
        return undefined
      }

      const estimatedGas = await tokenContract.estimateGas
        .approve(
          [spender as Address, MaxUint256], // TODO: Fix viem
          // @ts-ignore
          {
            account: tokenContract.account,
          },
        )
        .catch((err) => {
          console.info('try estimate approve max failure', err)
          // general fallback for tokens who restrict approval amounts
          return tokenContract.estimateGas
            .approve(
              [spender as Address, overrideAmountApprove ?? amountToApprove?.quotient ?? targetAmount ?? MaxUint256],
              // @ts-ignore
              {
                account: tokenContract.account,
              },
            )
            .catch((e) => {
              console.error('estimate gas failure', e)
              toastError('Error', 'Unexpected error. Could not estimate gas for the approve.')
              setIsPendingError(true)
              return null
            })
        })

      if (!estimatedGas) return undefined
      const finalAmount =
        overrideAmountApprove ?? amountToApprove?.quotient ?? targetAmount ?? MaxUint256
      const res = callWithGasPrice(tokenContract, 'approve' as const, [spender as Address, finalAmount], {
        gas: calculateGasMargin(estimatedGas),
      })
        .then((response) => {
          if (addToTransaction && token) {
            addTransaction(response, {
              summary: `Approve ${overrideAmountApprove ?? amountToApprove?.currency?.symbol}`,
              translatableSummary: {
                text: 'Approve %symbol%',
                data: { symbol: overrideAmountApprove?.toString() ?? amountToApprove?.currency?.symbol ?? "" },
              },
              approval: { tokenAddress: token.address, spender, amount: finalAmount.toString() },
              type: 'approve',
            })
          }
          return response
        })
        .catch((error: any) => {
          console.error('Failed to approve token', error)
          toastError('Error', getViemErrorMessage(error))
          throw error
        })

      return res
    },
    [
      approvalState,
      token,
      tokenContract,
      amountToApprove,
      spender,
      callWithGasPrice,
      targetAmount,
      toastError,
      addToTransaction,
      addTransaction,
    ],
  )

  const approveNoCheck = useCallback(
    async (overrideAmountApprove?: bigint) => {
      return approve(overrideAmountApprove, false)
    },
    [approve],
  )

  const approveCallback = useCallback(() => {
    return approve()
  }, [approve])

  const revokeCallback = useCallback(() => {
    return approve(0n)
  }, [approve])

  const revokeNoCheck = useCallback(() => {
    return approveNoCheck(0n)
  }, [approveNoCheck])

  return {
    approvalState,
    approveCallback,
    approveNoCheck,
    revokeCallback,
    revokeNoCheck,
    currentAllowance,
    isPendingError,
  }
}

export function useApproveCallbackFromAmount({
  token,
  minAmount,
  targetAmount,
  spender,
  addToTransaction,
}: {
  token?: ERC20Token
  minAmount?: bigint
  targetAmount?: bigint
  spender?: string
  addToTransaction?: boolean
}) {
  const amountToApprove = useMemo(() => {
    if (!minAmount || !token) return undefined
    return CurrencyAmount.fromRawAmount(token, minAmount)
  }, [minAmount, token])

  return useApproveCallback(amountToApprove, spender, {
    addToTransaction,
    targetAmount,
  })
}