import { Currency, CurrencyAmount, Percent, TradeType, Pair } from 'libraries/swap-sdk'
import { Text } from 'components'
import { QuestionToolTip } from 'components/QuestionHelper/QuestionToolTip'

import { AutoColumn } from 'components/Layout/Column'
import { RowBetween, RowFixed } from 'components/Layout/Row'
import { Field } from 'state/swap/actions'
import FormattedPriceImpact from './FormattedPriceImpact'
import { RouterViewer } from './RouterViewer'
import SwapRoute from './SwapRoute'

function TradeSummary({
  inputAmount,
  outputAmount,
  tradeType,
  slippageAdjustedAmounts,
  priceImpactWithoutFee,
  realizedLPFee,
}: {
  hasStablePair?: boolean
  inputAmount?: CurrencyAmount<Currency>
  outputAmount?: CurrencyAmount<Currency>
  tradeType?: TradeType
  slippageAdjustedAmounts: {
    INPUT?: CurrencyAmount<Currency>
    OUTPUT?: CurrencyAmount<Currency>
  }
  priceImpactWithoutFee?: Percent
  realizedLPFee?: CurrencyAmount<Currency>
}) {
  const isExactIn = tradeType === TradeType.EXACT_INPUT

  return (
    <AutoColumn style={{ padding: '0 16px' }}>
      <RowBetween>
        <RowFixed>
          <QuestionToolTip
            text='Your transaction will revert if there is a large, unfavorable price movement before it is confirmed.'
            placement="right-end"
          >
            <Text fontSize="14px" color="textSubtle">
              {isExactIn ? 'Minimum received' : 'Maximum sold'}
            </Text>
          </QuestionToolTip>
        </RowFixed>
        <RowFixed>
          <Text fontSize="14px">
            {isExactIn
              ? `${slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4)} ${outputAmount?.currency?.symbol}` ?? '-'
              : `${slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4)} ${inputAmount?.currency?.symbol}` ?? '-'}
          </Text>
        </RowFixed>
      </RowBetween>
      {priceImpactWithoutFee && (
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
      )}

      {realizedLPFee && (
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
          <Text fontSize="14px">{`${realizedLPFee.toSignificant(4)} ${inputAmount?.currency?.symbol}`}</Text>
        </RowBetween>
      )}
    </AutoColumn>
  )
}

export interface AdvancedSwapDetailsProps {
  pairs?: Pair[]
  path?: Currency[]
  priceImpactWithoutFee?: Percent
  realizedLPFee?: CurrencyAmount<Currency>
  slippageAdjustedAmounts?: {
    INPUT?: CurrencyAmount<Currency>
    OUTPUT?: CurrencyAmount<Currency>
  }
  inputAmount?: CurrencyAmount<Currency>
  outputAmount?: CurrencyAmount<Currency>
  tradeType?: TradeType
}

export function AdvancedSwapDetails({
  pairs,
  path,
  priceImpactWithoutFee,
  realizedLPFee,
  slippageAdjustedAmounts,
  inputAmount,
  outputAmount,
  tradeType,
}: AdvancedSwapDetailsProps) {
  const showRoute = Boolean(path && path.length > 1)
  return (
    <AutoColumn gap="0px">
      {inputAmount && (
        <>
          <TradeSummary
            inputAmount={inputAmount}
            outputAmount={outputAmount}
            tradeType={tradeType}
            slippageAdjustedAmounts={slippageAdjustedAmounts ?? {}}
            priceImpactWithoutFee={priceImpactWithoutFee}
            realizedLPFee={realizedLPFee}
          />
          {showRoute && (
            <>
              <RowBetween style={{ padding: '0 16px' }}>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <QuestionToolTip
                    text='Routing through these tokens resulted in the best price for your trade.'
                    placement="right-end"
                  >
                    <Text fontSize="14px" color="textSubtle">
                      Route
                    </Text>
                  </QuestionToolTip>
                </span>
                {path ? 
                  <QuestionToolTip
                    text={<RouterViewer
                      inputCurrency={inputAmount?.currency}
                      pairs={pairs}
                      path={path}
                      outputCurrency={outputAmount?.currency}
                    />}
                    placement="top"
                  >
                    <SwapRoute path={path} />
                  </QuestionToolTip>
                : null}
              </RowBetween>
            </>
          )}
        </>
      )}
    </AutoColumn>
  )
}
