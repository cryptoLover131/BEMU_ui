import React, { useEffect, useRef } from 'react'
import merge from 'lodash/merge'
import pickBy from 'lodash/pickBy'
import forEach from 'lodash/forEach'
import { usePublicClient } from 'wagmi'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useToast } from 'contexts'
import { TransactionNotFoundError } from 'viem'
import { retry, RetryableError } from 'state/multicall/retry'
import { useAppDispatch } from '../index'
import {
  finalizeTransaction
} from './actions'
import { useAllChainTransactions } from './hooks'
import { TransactionDetails } from './reducer'

export function shouldCheck(
  fetchedTransactions: { [txHash: string]: TransactionDetails },
  tx: TransactionDetails,
): boolean {
  if (tx.receipt) return false
  return !fetchedTransactions[tx.hash]
}

export const Updater: React.FC<{ chainId: number }> = ({ chainId }) => {
  const provider = usePublicClient({ chainId })

  const dispatch = useAppDispatch()
  const transactions = useAllChainTransactions(chainId)

  const { toastError, toastSuccess } = useToast()

  const fetchedTransactions = useRef<{ [txHash: string]: TransactionDetails }>({})

  useEffect(() => {
    if (!chainId || !provider) return

    forEach(
      pickBy(transactions, (transaction) => shouldCheck(fetchedTransactions.current, transaction)),
      (transaction) => {
        const getTransaction = async () => {
          try {
            const receipt: any = await provider.waitForTransactionReceipt({ hash: transaction.hash })

            dispatch(
              finalizeTransaction({
                chainId,
                hash: transaction.hash,
                receipt: {
                  blockHash: receipt.blockHash,
                  blockNumber: Number(receipt.blockNumber),
                  contractAddress: receipt.contractAddress,
                  from: receipt.from,
                  status: receipt.status === 'success' ? 1 : 0,
                  to: receipt.to,
                  transactionHash: receipt.transactionHash,
                  transactionIndex: receipt.transactionIndex,
                },
              }),
            )
            const toast = receipt.status === 'success' ? toastSuccess : toastError
            toast(
              'Transaction receipt',
              <ToastDescriptionWithTx txHash={receipt.transactionHash} txChainId={chainId} />,
            )

            merge(fetchedTransactions.current, { [transaction.hash]: transactions[transaction.hash] })
          } catch (error) {
            console.error(error)
            if (error instanceof TransactionNotFoundError) {
              throw new RetryableError(`Transaction not found: ${transaction.hash}`)
            }
          }
          merge(fetchedTransactions.current, { [transaction.hash]: transactions[transaction.hash] })
        }
        retry(getTransaction, {
          n: 10,
          minWait: 5000,
          maxWait: 10000,
        })
      },
    )
  }, [chainId, provider, transactions, dispatch, toastSuccess, toastError])

  return null
}

export default Updater
