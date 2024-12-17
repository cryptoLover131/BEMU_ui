import { useModal } from 'widgets/Modal'
import { useToast } from 'contexts'
import { BIG_ZERO } from 'utils/bigNumber'
import { GTOKEN } from 'libraries/tokens'
import BigNumber from 'bignumber.js'
import { ToastDescriptionWithTx } from 'components/Toast'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { BASE_ADD_LIQUIDITY_URL } from 'config'
import useCatchTxError from 'hooks/useCatchTxError'
import { useERC20 } from 'hooks/useContracts'
import { useRouter } from 'next/router'
import { useCallback, useMemo } from 'react'
import { useAppDispatch } from 'state'
import { fetchFarmUserDataAsync } from 'state/farms'
import useBUSDPrice from 'hooks/useBUSDPrice'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import { WNATIVE, NATIVE } from 'libraries/swap-sdk'
import { useAccount } from 'wagmi'
import { FarmWithStakedValue } from 'libraries/farms'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import useApproveFarm from '../hooks/useApproveFarm'
import useStakeFarms from '../hooks/useStakeFarms'
import useUnstakeFarms from '../hooks/useUnstakeFarms'
import DepositModal from './DepositModal'
import WithdrawModal from './WithdrawModal'
import StakedActionComponent from './StakedActionComponent'
import StakedLP from './StakedLP'
import StakeComponent from './StakeComponent'
import AccountNotConnect from './AccountNotConnect'

interface StackedActionProps extends FarmWithStakedValue {
  userDataReady: boolean
  lpLabel?: string
  displayApr?: string
  onStake: (value: string) => Promise<any>
  onUnstake: (value: string) => Promise<any>
  onDone: () => void
  onApprove: (amount: bigint) => Promise<any>
  isApproved?: boolean
  shouldUseProxyFarm?: boolean
  isTokenOnly?: boolean
}

export function useStakedActions(lpContract, pid) {
  const { account, chainId } = useAccountActiveChain()
  const { onStake } = useStakeFarms(pid)
  const { onUnstake } = useUnstakeFarms(pid)
  const dispatch = useAppDispatch()

  const { onApprove } = useApproveFarm(lpContract, chainId)

  const onDone = useCallback(
    () => {
      if (account && chainId)
        dispatch(fetchFarmUserDataAsync({ account, pids: [pid], chainId }))
    },
    [account, pid, chainId, dispatch],
  )

  return {
    onStake,
    onUnstake,
    onApprove,
    onDone,
  }
}

export const StakedContainer = ({ children, ...props }) => {
  const { address: account } = useAccount()

  const { lpAddress } = props
  const lpContract = useERC20(lpAddress)
  const { onStake, onUnstake, onApprove, onDone } = useStakedActions(lpContract, props.pid)

  const { allowance } = props.userData || {}

  const isApproved = account && allowance && allowance.isGreaterThan(0)

  return children({
    ...props,
    onStake,
    onDone,
    onUnstake,
    onApprove,
    isApproved,
  })
}

const Staked: React.FunctionComponent<React.PropsWithChildren<StackedActionProps>> = ({
  pid,
  apr,
  multiplier,
  lpSymbol,
  lpLabel,
  lpTokenPrice,
  quoteToken,
  token,
  displayApr,
  lpTotalSupply,
  tokenAmountTotal,
  quoteTokenAmountTotal,
  userData,
  onDone,
  onStake,
  onUnstake,
  onApprove,
  isTokenOnly
}) => {
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { account, chainId } = useAccountActiveChain()

  const { tokenBalance, stakedBalance, allowance } = userData || {}

  const router = useRouter()
  const _cakePrice = useBUSDPrice(GTOKEN[chainId])

  const cakePrice = useMemo(() => (_cakePrice ? new BigNumber(_cakePrice.toSignificant(6)) : BIG_ZERO), [_cakePrice])

  const liquidityUrlPathParts = getLiquidityUrlPathParts({
    quoteTokenAddress: quoteToken.address,
    tokenAddress: token.address,
    chainId,
  })
  const addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`

  const isStakeReady = useMemo(() => {
    return ['history', 'archived'].some((item) => router.pathname.includes(item))
  }, [router])

  const handleStake = async (amount: string) => {
    const receipt = await fetchWithCatchTxError(() => onStake(amount))

    if (receipt?.status) {
      toastSuccess(
        'Staked!',
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {isTokenOnly ? 'Your funds have been staked in the pool' : 'Your funds have been staked in the farm'}
        </ToastDescriptionWithTx>,
      )
      onDone()
    }
  }

  const handleUnstake = async (amount: string) => {
    const receipt = await fetchWithCatchTxError(() => onUnstake(amount))
    if (receipt?.status) {
      toastSuccess(
        'Unstaked',
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          Your earnings have also been harvested to your wallet
        </ToastDescriptionWithTx>,
      )
      onDone()
    }
  }

  const handleApprove = useCallback(async (amount: bigint) => {
    const receipt = await fetchWithCatchTxError(() => onApprove(amount))
    if (receipt?.status) {
      toastSuccess('Contract Enabled', <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
      onDone()
    }
  }, [onApprove, toastSuccess, fetchWithCatchTxError, onDone])

  const [onPresentDeposit] = useModal(
    <DepositModal
      account={account}
      pid={pid}
      lpTotalSupply={lpTotalSupply ?? BIG_ZERO}
      max={tokenBalance ?? BIG_ZERO}
      lpPrice={lpTokenPrice}
      lpLabel={lpLabel}
      apr={apr ?? undefined}
      displayApr={displayApr}
      stakedBalance={stakedBalance ?? BIG_ZERO}
      tokenName={lpSymbol}
      multiplier={multiplier}
      addLiquidityUrl={isTokenOnly ? `/swap?outputCurrency=${token.address}` : `/add/${addLiquidityUrl}`}
      cakePrice={cakePrice}
      decimals={18}
      allowance={allowance}
      enablePendingTx={pendingTx}
      onConfirm={handleStake}
      handleApprove={handleApprove}
      isTokenOnly={isTokenOnly}
    />,
    true,
    true,
    `farm-deposit-modal-${pid}`,
  )

  const [onPresentWithdraw] = useModal(
    <WithdrawModal
      max={stakedBalance ?? BIG_ZERO}
      onConfirm={handleUnstake}
      lpPrice={lpTokenPrice}
      tokenName={lpSymbol}
      decimals={18}
      isTokenOnly={isTokenOnly}
    />,
  )

  if (!account) {
    return <AccountNotConnect>
      <ConnectWalletButton />
    </AccountNotConnect>
  }

  // if (!isApproved && stakedBalance?.eq(0)) {
  //   return <EnableStakeAction pendingTx={pendingTx} handleApprove={handleApprove} />
  // }

  // if (!userDataReady) {
  //   return <StakeActionDataNotReady />
  // }

  if (stakedBalance?.gt(0)) {
    return (
      <StakedActionComponent
        lpSymbol={lpSymbol}
        disabledPlusButton={isStakeReady}
        onPresentWithdraw={onPresentWithdraw}
        onPresentDeposit={onPresentDeposit}
      >
        <StakedLP
          decimals={18}
          stakedBalance={stakedBalance}
          quoteTokenSymbol={
            WNATIVE[chainId]?.symbol === quoteToken.symbol ? NATIVE[chainId]?.symbol : quoteToken.symbol
          }
          tokenSymbol={WNATIVE[chainId]?.symbol === token.symbol ? NATIVE[chainId]?.symbol : token.symbol}
          lpTotalSupply={lpTotalSupply ?? BIG_ZERO}
          lpTokenPrice={lpTokenPrice ?? BIG_ZERO}
          tokenAmountTotal={tokenAmountTotal ?? BIG_ZERO}
          quoteTokenAmountTotal={quoteTokenAmountTotal ?? BIG_ZERO}
          isTokenOnly={isTokenOnly}
        />
      </StakedActionComponent>
    )
  }

  return (
    <StakeComponent
      lpSymbol={lpSymbol}
      isStakeReady={isStakeReady}
      onPresentDeposit={onPresentDeposit}
    />
  )
}

export default Staked
