import { useMemo, useState } from 'react'
import { Trade, TradeType, CurrencyAmount, Currency } from 'libraries/swap-sdk'
import { Text, AutoRenewIcon } from 'components'
import { CommitButton } from 'components/CommitButton'
import { QuestionToolTip } from 'components/QuestionHelper/QuestionToolTip'
import { Field } from 'state/swap/actions'
import { computeTradePriceBreakdown, formatExecutionPrice, warningSeverity } from 'utils/exchange'
import { AutoColumn } from 'components/Layout/Column'
import { AutoRow, RowBetween, RowFixed } from 'components/Layout/Row'
import FormattedPriceImpact from './FormattedPriceImpact'
import { StyledBalanceMaxMini, SwapCallbackError } from './styleds'

export default function SwapModalFooter({
  trade,
  slippageAdjustedAmounts,
  isEnoughInputBalance,
  onConfirm,
  swapErrorMessage,
  disabledConfirm,
}: {
  trade: Trade<Currency, Currency, TradeType>
  slippageAdjustedAmounts: { [field in Field]?: CurrencyAmount<Currency> }
  isEnoughInputBalance: boolean
  onConfirm: () => void
  swapErrorMessage?: string | undefined
  disabledConfirm: boolean
}) {
  const [showInverted, setShowInverted] = useState<boolean>(false)
  const { priceImpactWithoutFee, realizedLPFee } = useMemo(() => computeTradePriceBreakdown(trade), [trade])
  const severity = warningSeverity(priceImpactWithoutFee)

  return (
    <>
      <AutoColumn>
        <RowBetween align="center">
          <Text fontSize="14px">Price</Text>
          <Text
            fontSize="14px"
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
              textAlign: 'right',
              paddingLeft: '10px',
            }}
          >
            {formatExecutionPrice(trade, showInverted)}
            <StyledBalanceMaxMini onClick={() => setShowInverted(!showInverted)}>
              <AutoRenewIcon width="14px" />
            </StyledBalanceMaxMini>
          </Text>
        </RowBetween>

        <RowBetween>
          <RowFixed>
            <QuestionToolTip
              text='Your transaction will revert if there is a large, unfavorable price movement before it is confirmed.'
              placement="right-end"
            >
              <Text fontSize="14px" color="textSubtle">
                {trade.tradeType === TradeType.EXACT_INPUT ? 'Minimum received' : 'Maximum sold'}
              </Text>
            </QuestionToolTip>
          </RowFixed>
          <RowFixed>
            <Text fontSize="14px">
              {trade.tradeType === TradeType.EXACT_INPUT
                ? slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4) ?? '-'
                : slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4) ?? '-'}
            </Text>
            <Text fontSize="14px" marginLeft="4px">
              {trade.tradeType === TradeType.EXACT_INPUT
                ? trade.outputAmount.currency.symbol
                : trade.inputAmount.currency.symbol}
            </Text>
          </RowFixed>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <QuestionToolTip
              text='The difference between the market price and estimated price due to trade size.'
              placement="right-end"
            >
              <Text fontSize="14px" color="textSubtle">
                Price Impact
              </Text>
            </QuestionToolTip>
          </RowFixed>
          <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <QuestionToolTip
              text="Fees are applied to ensure the best experience with Uniswap, and have already been factored into this quote."
              placement="right-end"
            >
              <Text fontSize="14px" color="textSubtle">
                Liquidity Provider Fee
              </Text>
            </QuestionToolTip>
          </RowFixed>
          <Text fontSize="14px">
            {realizedLPFee ? `${realizedLPFee?.toSignificant(6)} ${trade.inputAmount.currency.symbol}` : '-'}
          </Text>
        </RowBetween>
      </AutoColumn>

      <AutoRow>
        <CommitButton
          variant={severity > 2 ? 'danger' : 'primary'}
          onClick={onConfirm}
          disabled={disabledConfirm}
          mt="12px"
          id="confirm-swap-or-send"
          width="100%"
          height="48px"
        >
          {severity > 2 || (trade.tradeType === TradeType.EXACT_OUTPUT && !isEnoughInputBalance)
            ? 'Swap Anyway'
            : 'Confirm Swap'}
        </CommitButton>

        {swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
      </AutoRow>
    </>
  )
}
