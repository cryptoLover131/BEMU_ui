import { TradeType, CurrencyAmount, Currency, Percent } from 'libraries/swap-sdk'
import { Text } from 'components'
import { warningSeverity, basisPointsToPercent } from 'utils/exchange'
import { AutoColumn } from 'components/Layout/Column'
import { CurrencyLogo } from 'components/Logo'
import { RowBetween, RowFixed } from 'components/Layout/Row'

export default function SwapModalHeader({
  inputAmount,
  outputAmount,
  tradeType,
  priceImpactWithoutFee,
  isEnoughInputBalance,
  showAcceptChanges,
  allowedSlippage,
}: {
  inputAmount: CurrencyAmount<Currency>
  outputAmount: CurrencyAmount<Currency>
  tradeType: TradeType
  priceImpactWithoutFee?: Percent
  isEnoughInputBalance: boolean
  showAcceptChanges: boolean
  allowedSlippage: number
}) {
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  const inputTextColor =
    showAcceptChanges && tradeType === TradeType.EXACT_OUTPUT && isEnoughInputBalance
      ? 'primary'
      : tradeType === TradeType.EXACT_OUTPUT && !isEnoughInputBalance
      ? 'failure'
      : 'text'

  return (
    <AutoColumn gap="xs">
      <Text fontSize="14px" color='textDisabled'>From</Text>
      <RowBetween mb="16px">
        <RowFixed gap="0px">
          <Text fontSize="28px" color={inputTextColor}>
            {inputAmount.toSignificant(6)} {inputAmount.currency.symbol}
          </Text>
        </RowFixed>
        <RowFixed gap="4px">
          <CurrencyLogo currency={inputAmount.currency} size="36px" />
        </RowFixed>
      </RowBetween>
      <Text fontSize="14px" color='textDisabled'>To</Text>
      <RowBetween>
        <RowFixed gap="0px">
          <Text
            fontSize="28px"
            color={
              priceImpactSeverity > 2
                ? 'failure'
                : showAcceptChanges && tradeType === TradeType.EXACT_INPUT
                ? 'primary'
                : 'text'
            }
          >
            {outputAmount.toSignificant(6)} {outputAmount.currency.symbol}
          </Text>
        </RowFixed>
        <RowFixed>
          <CurrencyLogo currency={outputAmount.currency} size="36px" />
        </RowFixed>
      </RowBetween>
      {/* {!showAcceptChanges ? (
        <SwapShowAcceptChanges gap="0px">
          <RowBetween>
            <RowFixed>
              <ErrorIcon mr="8px" />
              <Text> Price Updated</Text>
            </RowFixed>
            <Button 
              onClick={onAcceptChanges} 
              width="80px" 
              height="36px"
              variant="text"
            >Accept</Button>
          </RowBetween>
        </SwapShowAcceptChanges>
      ) : null} */}
      <AutoColumn justify="flex-start" gap="sm" style={{ padding: '24px 0 0 0px' }}>
        <RowFixed style={{ width: '100%' }}>
          <Text fontSize="14px">
            Max. slippage
          </Text>
          <Text fontSize="14px" ml="auto" textAlign="end">
            {`${basisPointsToPercent(allowedSlippage).toFixed(1)}%`}
          </Text>
        </RowFixed>
      </AutoColumn>
    </AutoColumn>
  )
}
