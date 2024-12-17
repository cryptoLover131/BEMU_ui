import React, { useCallback } from 'react'
import { Currency, CurrencyAmount, Fraction, Percent, Token } from 'libraries/swap-sdk'
import { InjectedModalProps } from 'widgets/Modal'
import { ConfirmationModalContent } from 'widgets/ConfirmationModalContent'
import TransactionConfirmationModal from 'components/TransactionConfirmationModal'
import { CommitButton } from 'components/CommitButton'
import { TransactionErrorContent } from 'views/Swap/components/TransactionErrorContent'
import { Field } from 'state/burn/actions'
import _toNumber from 'lodash/toNumber'
import { AddLiquidityModalHeader, PairDistribution } from './common'

interface ConfirmAddLiquidityModalProps {
  title: string
  customOnDismiss: () => void
  attemptingTxn: boolean
  hash?: string
  pendingText: string
  currencies: { [field in Field]?: Currency }
  noLiquidity?: boolean
  allowedSlippage: number
  liquidityErrorMessage?: string
  price?: Fraction | null
  parsedAmounts: { [field in Field]?: CurrencyAmount<Currency> }
  onAdd: () => void
  poolTokenPercentage?: Percent
  liquidityMinted?: CurrencyAmount<Token>
  currencyToAdd?: Token | null
  isStable?: boolean
}

const ConfirmAddLiquidityModal: React.FC<
  React.PropsWithChildren<InjectedModalProps & ConfirmAddLiquidityModalProps>
> = ({
  title,
  onDismiss,
  customOnDismiss,
  attemptingTxn,
  hash,
  pendingText,
  price,
  currencies,
  noLiquidity,
  allowedSlippage,
  parsedAmounts,
  liquidityErrorMessage,
  onAdd,
  poolTokenPercentage,
  liquidityMinted,
  currencyToAdd,
  isStable,
}) => {
  let percent = 0.5

  // Calculate distribution percentage for display
  if ((isStable && parsedAmounts[Field.CURRENCY_A]) || parsedAmounts[Field.CURRENCY_B]) {
    const amountCurrencyA = parsedAmounts[Field.CURRENCY_A]
      ? _toNumber(parsedAmounts[Field.CURRENCY_A]?.toSignificant(6))
      : 0
    // If there is no price fallback to compare only amounts
    const currencyAToCurrencyB = (price && parseFloat(price?.toSignificant(4))) || 1
    const normalizedAmountCurrencyA = currencyAToCurrencyB * amountCurrencyA
    const amountCurrencyB = parsedAmounts[Field.CURRENCY_B]
      ? _toNumber(parsedAmounts[Field.CURRENCY_B]?.toSignificant(6))
      : 0

    percent = normalizedAmountCurrencyA / (normalizedAmountCurrencyA + amountCurrencyB)
  }

  const modalHeader = useCallback(() => {
    return (
      <AddLiquidityModalHeader
        allowedSlippage={allowedSlippage}
        currencies={currencies}
        liquidityMinted={liquidityMinted}
        poolTokenPercentage={poolTokenPercentage}
        price={price}
        noLiquidity={noLiquidity}
      >
        <PairDistribution
          title='Input'
          percent={percent}
          currencyA={currencies[Field.CURRENCY_A]}
          currencyAValue={parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}
          currencyB={currencies[Field.CURRENCY_B]}
          currencyBValue={parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}
        />
      </AddLiquidityModalHeader>
    )
  }, [allowedSlippage, percent, currencies, liquidityMinted, noLiquidity, parsedAmounts, poolTokenPercentage, price])

  const modalBottom = useCallback(() => {
    return (
      <CommitButton 
        width="100%" 
        onClick={onAdd} 
        mt="20px"
        height="48px"
        variant="primary"
      >
        {noLiquidity ? 'Create Pair & Supply' : 'Confirm Supply'}
      </CommitButton>
    )
  }, [noLiquidity, onAdd])

  const confirmationContent = useCallback(
    () =>
      liquidityErrorMessage ? (
        <TransactionErrorContent message="" onDismiss={onDismiss} />
      ) : (
        <ConfirmationModalContent topContent={modalHeader} bottomContent={modalBottom} />
      ),
    [onDismiss, modalBottom, modalHeader, liquidityErrorMessage],
  )

  return (
    <TransactionConfirmationModal
      minWidth={['100%', null, '420px']}
      title={title}
      onDismiss={onDismiss}
      customOnDismiss={customOnDismiss}
      attemptingTxn={attemptingTxn}
      currencyToAdd={currencyToAdd}
      hash={hash}
      content={confirmationContent}
      pendingText={pendingText}
    />
  )
}

export default ConfirmAddLiquidityModal
