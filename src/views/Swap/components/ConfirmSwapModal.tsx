import { useCallback, memo, useMemo } from 'react'
import { Trade, Currency, TradeType, CurrencyAmount } from 'libraries/swap-sdk'
import { InjectedModalProps, Modal } from 'widgets/Modal'
import { LinkExternal, Text } from 'components'
import { ConfirmationPendingContent } from 'widgets/ConfirmationPendingContent'
import { TransactionSubmittedContent } from 'components/TransactionConfirmationModal'
import { Field } from 'state/swap/actions'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { TransactionErrorContent } from './TransactionErrorContent'
import TransactionConfirmSwapContent from './TransactionConfirmSwapContent'

const PancakeRouterSlippageErrorMsg =
  'This transaction will not succeed either due to price movement or fee on transfer. Try increasing your slippage tolerance.'

const SwapTransactionErrorContent = ({ onDismiss, message, openSettingModal }) => {
  const isSlippagedErrorMsg = message?.includes(PancakeRouterSlippageErrorMsg)

  const handleErrorDismiss = useCallback(() => {
    onDismiss?.()
    if (isSlippagedErrorMsg && openSettingModal) {
      openSettingModal()
    }
  }, [isSlippagedErrorMsg, onDismiss, openSettingModal])

  return isSlippagedErrorMsg ? (
    <TransactionErrorContent
      message={
        <>
          <Text mb="16px">
            This transaction will not succeed either due to price movement or fee on transfer. Try increasing your{' '}
            <Text display="inline" style={{ cursor: 'pointer' }} onClick={handleErrorDismiss}>
              <u>slippage tolerance.</u>
            </Text>
          </Text>
          <LinkExternal
            href="https://docs.marvinonbase.com"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            What are the potential issues with the token?
          </LinkExternal>
        </>
      }
    />
  ) : (
    <TransactionErrorContent message={message} onDismiss={onDismiss} />
  )
}

interface ConfirmSwapModalProps {
  trade?: Trade<Currency, Currency, TradeType>
  originalTrade?: Trade<Currency, Currency, TradeType>
  currencyBalances: { [field in Field]?: CurrencyAmount<Currency> }
  attemptingTxn: boolean
  txHash?: string
  recipient?: string | null
  allowedSlippage: number
  onConfirm: () => void
  swapErrorMessage?: string
  customOnDismiss?: () => void
  openSettingModal?: () => void
}

const ConfirmSwapModal: React.FC<React.PropsWithChildren<InjectedModalProps & ConfirmSwapModalProps>> = ({
  trade,
  originalTrade,
  currencyBalances,
  allowedSlippage,
  onConfirm,
  onDismiss,
  customOnDismiss,
  swapErrorMessage,
  attemptingTxn,
  txHash,
  openSettingModal,
}) => {
  const { chainId } = useActiveChainId()

  const handleDismiss = useCallback(() => {
    if (customOnDismiss) {
      customOnDismiss()
    }
    onDismiss?.()
  }, [customOnDismiss, onDismiss])

  const confirmationContent = useCallback(
    () =>
      swapErrorMessage ? (
        <SwapTransactionErrorContent
          openSettingModal={openSettingModal}
          onDismiss={onDismiss}
          message={swapErrorMessage}
        />
      ) : (
        <TransactionConfirmSwapContent
          trade={trade}
          currencyBalances={currencyBalances}
          originalTrade={originalTrade}
          allowedSlippage={allowedSlippage}
          onConfirm={onConfirm}
        />
      ),
    [
      trade,
      originalTrade,
      allowedSlippage,
      onConfirm,
      swapErrorMessage,
      onDismiss,
      openSettingModal,
      currencyBalances,
    ],
  )

  // text to show while loading
  const pendingText = useMemo(() => {
    return `Swapping ${trade?.inputAmount?.toSignificant(6) ?? ''} ${trade?.inputAmount?.currency?.symbol ?? ''} for ${trade?.outputAmount?.toSignificant(6) ?? ''} ${trade?.outputAmount?.currency?.symbol ?? ''}`
  }, [trade])

  if (!chainId) return null

  return (
    <Modal title="Review Swap" onDismiss={handleDismiss} bodyPadding='20px' minWidth={["100%", "418px"]}>
      {attemptingTxn ? (
        <ConfirmationPendingContent pendingText={pendingText} />
      ) : txHash ? (
        <TransactionSubmittedContent
          chainId={chainId}
          hash={txHash}
        />
      ) : (
        confirmationContent()
      )}
    </Modal>
  )
}

export default memo(ConfirmSwapModal)
