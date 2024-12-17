import React, { useCallback } from 'react'
import { Currency, CurrencyAmount, Pair, Percent, Token } from 'libraries/swap-sdk'
import {
  AddIcon,
  Button,
  Text,
} from 'components'
import { InjectedModalProps } from 'widgets/Modal'
import { ConfirmationModalContent } from 'widgets/ConfirmationModalContent'
import TransactionConfirmationModal from 'components/TransactionConfirmationModal'
import { AutoColumn } from 'components/Layout/Column'
import { RowBetween, RowFixed } from 'components/Layout/Row'
import { CurrencyLogo, DoubleCurrencyLogo } from 'components/Logo'
import { Field } from 'state/burn/actions'
import { ApprovalState } from 'hooks/useApproveCallback'
import { TransactionErrorContent } from './TransactionErrorContent'

interface ConfirmRemoveLiquidityModalProps {
  title: string
  customOnDismiss: () => void
  attemptingTxn: boolean
  pair?: Pair
  hash: string
  pendingText: string
  parsedAmounts: {
    [Field.LIQUIDITY_PERCENT]: Percent
    [Field.LIQUIDITY]?: CurrencyAmount<Token>
    [Field.CURRENCY_A]?: CurrencyAmount<Currency>
    [Field.CURRENCY_B]?: CurrencyAmount<Currency>
  }
  allowedSlippage: number
  onRemove: () => void
  liquidityErrorMessage?: string
  approval: ApprovalState
  signatureData?: any
  tokenA: Token
  tokenB: Token
  currencyA: Currency | undefined
  currencyB: Currency | undefined
}

const ConfirmRemoveLiquidityModal: React.FC<
  React.PropsWithChildren<InjectedModalProps & ConfirmRemoveLiquidityModalProps>
> = ({
  title,
  onDismiss,
  customOnDismiss,
  attemptingTxn,
  pair,
  hash,
  approval,
  signatureData,
  pendingText,
  parsedAmounts,
  allowedSlippage,
  onRemove,
  liquidityErrorMessage,
  tokenA,
  tokenB,
  currencyA,
  currencyB,
}) => {
  const modalHeader = useCallback(() => {
    return (
      <AutoColumn gap="md">
        {parsedAmounts[Field.CURRENCY_A] && (
          <RowBetween align="flex-end">
            <Text fontSize="24px">{parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}</Text>
            <RowFixed gap="4px">
              <CurrencyLogo currency={currencyA} size="24px" />
              <Text fontSize="24px" ml="10px">
                {currencyA?.symbol}
              </Text>
            </RowFixed>
          </RowBetween>
        )}
        {parsedAmounts[Field.CURRENCY_A] && parsedAmounts[Field.CURRENCY_B] && (
          <RowFixed>
            <AddIcon width="16px" />
          </RowFixed>
        )}
        {parsedAmounts[Field.CURRENCY_B] && (
          <RowBetween align="flex-end">
            <Text fontSize="24px">{parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}</Text>
            <RowFixed gap="4px">
              <CurrencyLogo currency={currencyB} size="24px" />
              <Text fontSize="24px" ml="10px">
                {currencyB?.symbol}
              </Text>
            </RowFixed>
          </RowBetween>
        )}

        <Text small textAlign="left" pt="12px">
          Output is estimated. If the price changes by more than {allowedSlippage / 100}% your transaction will revert.
        </Text>
      </AutoColumn>
    )
  }, [allowedSlippage, currencyA, currencyB, parsedAmounts])

  const modalBottom = useCallback(() => {
    return (
      <>
        <RowBetween>
          <Text>
            { currencyA?.symbol ?? '' }/{ currencyB?.symbol ?? '' } Burned
          </Text>
          <RowFixed>
            <DoubleCurrencyLogo currency0={currencyA} currency1={currencyB} margin />
            <Text>{parsedAmounts[Field.LIQUIDITY]?.toSignificant(6)}</Text>
          </RowFixed>
        </RowBetween>
        {pair && (
          <>
            <RowBetween>
              <Text>Price</Text>
              <Text>
                1 {currencyA?.symbol} = {tokenA ? pair.priceOf(tokenA).toSignificant(6) : '-'} {currencyB?.symbol}
              </Text>
            </RowBetween>
            <RowBetween>
              <div />
              <Text>
                1 {currencyB?.symbol} = {tokenB ? pair.priceOf(tokenB).toSignificant(6) : '-'} {currencyA?.symbol}
              </Text>
            </RowBetween>
          </>
        )}
        <Button
          width="100%"
          mt="20px"
          disabled={!(approval === ApprovalState.APPROVED || signatureData !== null)}
          onClick={onRemove}
          height="48px"
          variant='primary'
        >
          Confirm
        </Button>
      </>
    )
  }, [currencyA, currencyB, parsedAmounts, approval, onRemove, pair, tokenA, tokenB, signatureData])

  const confirmationContent = useCallback(
    () =>
      liquidityErrorMessage ? (
        <>
          <TransactionErrorContent message="" onDismiss={onDismiss} />
        </>
      ) : (
        <ConfirmationModalContent topContent={modalHeader} bottomContent={modalBottom} />
      ),
    [liquidityErrorMessage, onDismiss, modalHeader, modalBottom],
  )

  return (
    <TransactionConfirmationModal
      title={title}
      onDismiss={onDismiss}
      customOnDismiss={customOnDismiss}
      attemptingTxn={attemptingTxn}
      hash={hash}
      content={confirmationContent}
      pendingText={pendingText}
    />
  )
}

export default ConfirmRemoveLiquidityModal
