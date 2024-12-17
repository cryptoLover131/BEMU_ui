import { useMemo } from 'react'
import { ChainId } from 'config/chains'
import { Currency, CurrencyAmount, Percent, Price, Trade, TradeType, Pair } from 'libraries/swap-sdk'

import { Field } from 'state/swap/actions'
import { ROUTER_ADDRESS } from 'config/constants/exchange'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown } from 'utils/exchange'

interface Options {
  trade?: Trade<Currency, Currency, TradeType> | null
  useSmartRouter?: boolean
  allowedSlippage: number
  chainId: ChainId
  swapInputError?: string
}

interface Info {
  tradeType: TradeType
  inputAmount: CurrencyAmount<Currency>
  outputAmount: CurrencyAmount<Currency>
  route: {
    pairs: Pair[]
    path: Currency[]
  }
  slippageAdjustedAmounts: { [field in Field]?: CurrencyAmount<Currency> }
  executionPrice: Price<Currency, Currency>
  routerAddress: string
  priceImpactWithoutFee?: Percent
  realizedLPFee?: CurrencyAmount<Currency> | null
  inputError: string | undefined
}

export function useTradeInfo({
  trade,
  allowedSlippage = 0,
  chainId,
  swapInputError,
}: Options): Info | null {
  return useMemo(() => {
    if (trade) {
      const { priceImpactWithoutFee, realizedLPFee } = computeTradePriceBreakdown(trade)
      return {
        tradeType: trade.tradeType,
        route: trade.route,
        inputAmount: trade.inputAmount,
        outputAmount: trade.outputAmount,
        slippageAdjustedAmounts: computeSlippageAdjustedAmounts(trade, allowedSlippage),
        executionPrice: trade.executionPrice,
        routerAddress: ROUTER_ADDRESS[chainId],
        priceImpactWithoutFee,
        realizedLPFee,
        inputError: swapInputError,
      }
    }
    return null
  }, [trade, allowedSlippage, chainId, swapInputError])
}
