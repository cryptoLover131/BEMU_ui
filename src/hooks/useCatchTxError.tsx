import { useToast } from 'contexts'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useCallback, useState } from 'react'
import { getViemErrorMessage, parseViemError } from 'utils/errors'
import { isUserRejected } from 'utils/reject'
import { Address, Hash } from 'viem'
import { usePublicNodeWaitForTransaction } from './usePublicNodeWaitForTransaction'

const notPreview = process.env.NEXT_PUBLIC_VERCEL_ENV !== 'preview'

type Params = {
  throwUserRejectError?: boolean
  throwCustomError?: () => void
}

export default function useCatchTxError(params?: Params) {
  const { throwUserRejectError = false, throwCustomError } = params || {}
  const { toastError, toastSuccess } = useToast()
  const [loading, setLoading] = useState(false)
  const { waitForTransaction } = usePublicNodeWaitForTransaction()
  const [txResponseLoading, setTxResponseLoading] = useState(false)

  const handleNormalError = useCallback(
    (error) => {
      const err = parseViemError(error)
      if (err) {
        toastError(
          'Error',
          `Transaction failed with error: ${notPreview ? error.shortMessage || error.message : error.message}`
        )
      } else {
        toastError('Error', 'Please try again. Confirm the transaction and make sure you are paying enough gas!')
      }
    },
    [toastError],
  )

  const handleTxError = useCallback(
    (error, hash) => {
      const err = parseViemError(error)
      toastError(
        'Failed',
        <ToastDescriptionWithTx txHash={hash}>
          {err
            ? `Transaction failed with error: ${notPreview ? getViemErrorMessage(err) : err.message}`
            : 'Transaction failed. For detailed error message:'}
        </ToastDescriptionWithTx>,
      )
    },
    [toastError],
  )

  const fetchWithCatchTxError = useCallback(
    async (callTx: () => Promise<{ hash: Address } | Hash | undefined>) => {
      let tx: { hash: Address } | Hash | null | undefined = null

      try {
        setLoading(true)

        tx = await callTx()
        if (!tx) {
          return null
        }
        const hash = typeof tx === 'string' ? tx : tx.hash
        toastSuccess('Transaction Submitted!', <ToastDescriptionWithTx txHash={hash} />)

        const receipt = await waitForTransaction({
          hash,
        })
        if (receipt?.status === 'success') {
          return receipt
        }
        throw Error('Failed')
      } catch (error: any) {
        if (!isUserRejected(error)) {
          if (!tx) {
            handleNormalError(error)
          } else if (throwCustomError) {
            throwCustomError()
          } else {
            handleTxError(error, typeof tx === 'string' ? tx : tx.hash)
          }
        }
        if (throwUserRejectError) {
          throw error
        }
      } finally {
        setLoading(false)
      }

      return null
    },
    [toastSuccess, waitForTransaction, throwUserRejectError, throwCustomError, handleNormalError, handleTxError],
  )

  const fetchTxResponse = useCallback(
    async (callTx: () => Promise<{ hash: Address } | Hash | undefined>): Promise<{ hash: Address } | null> => {
      let tx: { hash: Address } | Hash | null | undefined = null

      try {
        setTxResponseLoading(true)

        /**
         * https://github.com/vercel/swr/pull/1450
         *
         * wait for useSWRMutation finished, so we could apply SWR in case manually trigger tx call
         */
        tx = await callTx()

        if (!tx) return null

        const hash = typeof tx === 'string' ? tx : tx.hash

        toastSuccess(`Transaction Submitted!`, <ToastDescriptionWithTx txHash={hash} />)

        return { hash }
      } catch (error: any) {
        if (!isUserRejected(error)) {
          if (!tx) {
            handleNormalError(error)
          } else {
            handleTxError(error, typeof tx === 'string' ? tx : tx.hash)
          }
        }
      } finally {
        setTxResponseLoading(false)
      }

      return null
    },
    [toastSuccess, handleNormalError, handleTxError],
  )

  return {
    fetchWithCatchTxError,
    fetchTxResponse,
    loading,
    txResponseLoading,
  }
}
