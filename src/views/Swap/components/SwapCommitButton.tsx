import { useCallback, useEffect, useState } from 'react'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useModal } from 'widgets/Modal'
import { Currency, CurrencyAmount, Trade, TradeType } from 'libraries/swap-sdk'
import {
  ALLOWED_PRICE_IMPACT_HIGH,
  PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN,
} from 'config/constants/exchange'
import { WrapType } from 'hooks/useWrapCallback'
import { useSwapCallback } from 'hooks/useSwapCallback'
import { useSwapCallArguments } from 'hooks/useSwapCallArguments'
import { ApprovalState } from 'hooks/useApproveCallback'
import { computeTradePriceBreakdown, warningSeverity } from 'utils/exchange'
import { Button, Text } from 'components'
import { AutoRow, RowBetween } from 'components/Layout/Row'
import { CommitButton } from 'components/CommitButton'
import CircleLoader from 'components/Loader/CircleLoader'
import SettingsModal, { withCustomOnDismiss } from 'components/Menu/GlobalSettings/SettingsModal'
import { SettingsMode } from 'components/Menu/GlobalSettings/types'
import Column from 'components/Layout/Column'
import { Field } from 'state/swap/actions'
import ConfirmSwapModal from './ConfirmSwapModal'
import { confirmPriceImpactWithoutFee } from './confirmPriceImpactWithoutFee'
import ProgressSteps from './ProgressSteps'
import { SwapCallbackError } from './styleds'

const SettingsModalWithCustomDismiss = withCustomOnDismiss(SettingsModal)

interface SwapCommitButtonPropsType {
  account?: string
  showWrap: boolean
  wrapInputError?: string
  onWrap?: () => Promise<void>
  wrapType: WrapType
  approval: ApprovalState
  approveCallback: () => Promise<any>
  approvalSubmitted: boolean
  currencies: {
    INPUT?: Currency
    OUTPUT?: Currency
  }
  trade?: Trade<Currency, Currency, TradeType>
  swapInputError?: string
  currencyBalances: {
    INPUT?: CurrencyAmount<Currency>
    OUTPUT?: CurrencyAmount<Currency>
  }
  recipient: string | null
  allowedSlippage: number
  parsedIndepentFieldAmount?: CurrencyAmount<Currency>
  onUserInput: (field: Field, typedValue: string) => void
}

export default function SwapCommitButton({
  account,
  showWrap,
  wrapInputError,
  onWrap,
  wrapType,
  approval,
  approveCallback,
  approvalSubmitted,
  currencies,
  trade,
  swapInputError,
  currencyBalances,
  recipient,
  allowedSlippage,
  onUserInput,
}: SwapCommitButtonPropsType) {
  const { open } = useWeb3Modal()
  const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade)

  const swapCalls = useSwapCallArguments(trade, allowedSlippage, recipient)

  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(
    trade ?? null,
    allowedSlippage,
    recipient,
    swapCalls,
  )
  const [{ tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
    tradeToConfirm: Trade<Currency, Currency, TradeType> | undefined
    attemptingTxn: boolean
    swapErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined,
  })

  // Handlers
  const handleSwap = useCallback(() => {
    // if (
    //   priceImpactWithoutFee &&
    //   !confirmPriceImpactWithoutFee(
    //     priceImpactWithoutFee,
    //     PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN,
    //     ALLOWED_PRICE_IMPACT_HIGH,
    //   )
    // ) {
    //   return
    // }
    if (!swapCallback) {
      return
    }
    setSwapState({ attemptingTxn: true, tradeToConfirm, swapErrorMessage: undefined, txHash: undefined })
    swapCallback()
      .then((hash) => {
        setSwapState({ attemptingTxn: false, tradeToConfirm, swapErrorMessage: undefined, txHash: hash })
      })
      .catch((error) => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          swapErrorMessage: error.message,
          txHash: undefined,
        })
      })
  }, [priceImpactWithoutFee, swapCallback, tradeToConfirm, setSwapState])

  useEffect(() => {
    setSwapState({ tradeToConfirm: trade, swapErrorMessage, txHash, attemptingTxn })
  }, [attemptingTxn, swapErrorMessage, trade, txHash, setSwapState])

  const handleConfirmDismiss = useCallback(() => {
    setSwapState({ tradeToConfirm, attemptingTxn, swapErrorMessage, txHash })
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '')
    }
  }, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, txHash, setSwapState])

  // End Handlers

  // Modals
  const [indirectlyOpenConfirmModalState, setIndirectlyOpenConfirmModalState] = useState(false)

  const [onPresentSettingsModal] = useModal(
    <SettingsModalWithCustomDismiss
      customOnDismiss={() => setIndirectlyOpenConfirmModalState(true)}
      mode={SettingsMode.SWAP_LIQUIDITY}
    />,
  )

  const [onPresentConfirmModal] = useModal(
    <ConfirmSwapModal
      trade={trade}
      originalTrade={tradeToConfirm}
      currencyBalances={currencyBalances}
      attemptingTxn={attemptingTxn}
      txHash={txHash}
      recipient={recipient}
      allowedSlippage={allowedSlippage}
      onConfirm={handleSwap}
      swapErrorMessage={swapErrorMessage}
      customOnDismiss={handleConfirmDismiss}
      openSettingModal={onPresentSettingsModal}
    />,
    true,
    true,
    'confirmSwapModal',
  )
  // End Modals

  const onSwapHandler = useCallback(() => {
    setSwapState({
      tradeToConfirm: trade,
      attemptingTxn: false,
      swapErrorMessage: undefined,
      txHash: undefined,
    })
    onPresentConfirmModal()
  }, [onPresentConfirmModal, trade])

  // useEffect
  useEffect(() => {
    if (indirectlyOpenConfirmModalState) {
      setIndirectlyOpenConfirmModalState(false)
      setSwapState((state) => ({
        ...state,
        swapErrorMessage: undefined,
      }))
      onPresentConfirmModal()
    }
  }, [indirectlyOpenConfirmModalState, onPresentConfirmModal, setSwapState])

  // warnings on slippage
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  if (!account) {
    return <Button
      width="100%"
      variant='primary'
      height="58px"
      onClick={() => open()}
    >
      <Text fontSize="20px">
        Connect Wallet
      </Text>
    </Button>
  }

  if (showWrap) {
    return (
      <CommitButton 
        width="100%" 
        disabled={Boolean(wrapInputError)} 
        onClick={onWrap} 
        height="58px"
        variant='primary'
        style={{fontSize: "20px"}}
      >
        {wrapInputError ?? (wrapType === WrapType.WRAP ? 'Wrap' : wrapType === WrapType.UNWRAP ? 'Unwrap' : "")}
      </CommitButton>
    )
  }

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !swapInputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED))

  const isValid = !swapInputError

  if (showApproveFlow) {
    return (
      <>
        <RowBetween>
          <CommitButton
            variant={approval === ApprovalState.APPROVED ? 'success' : 'primary'}
            onClick={approveCallback}
            disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
            width="48%"
            height="58px"
            style={{fontSize: "20px"}}
          >
            {approval === ApprovalState.PENDING ? (
              <AutoRow gap="6px" justify="center">
                Enabling <CircleLoader stroke="white" />
              </AutoRow>
            ) : approvalSubmitted && approval === ApprovalState.APPROVED ? (
              'Enabled'
            ) : (
              `Enable ${currencies[Field.INPUT]?.symbol ?? ''}`
            )}
          </CommitButton>
          <CommitButton
            variant={isValid ? 'danger' : 'primary'}
            onClick={() => {
              onSwapHandler()
            }}
            width="48%"
            height="58px"
            id="swap-button"
            disabled={!isValid || approval !== ApprovalState.APPROVED}
            style={{fontSize: "20px"}}
          >
            Swap
          </CommitButton>
        </RowBetween>
        <Column style={{ marginTop: '1rem' }}>
          <ProgressSteps steps={[approval === ApprovalState.APPROVED]} />
        </Column>
        {swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
      </>
    )
  }

  return (
    <>
      <CommitButton
        variant={isValid && !swapCallbackError ? 'danger' : 'primary'}
        onClick={() => {
          onSwapHandler()
        }}
        id="swap-button"
        width="100%"
        height="58px"
        disabled={!isValid || !!swapCallbackError}
        style={{fontSize: "20px"}}
      >
        Swap
      </CommitButton>

      {/* {swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null} */}
    </>
  )
}
