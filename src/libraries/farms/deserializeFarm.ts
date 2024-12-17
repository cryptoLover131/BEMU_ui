import BigNumber from 'bignumber.js'
import { deserializeToken } from 'libraries/token-lists'
import { BIG_ZERO } from 'utils/bigNumber'
import { SerializedFarm, DeserializedFarm } from './types'
import { deserializeFarmUserData } from './deserializeFarmUserData'

export const deserializeFarm = (
  farm: SerializedFarm
): DeserializedFarm => {
  const {
    isTokenOnly,
    lpAddress,
    lpSymbol,
    pid,
    multiplier,
    quoteTokenPriceBusd,
    tokenPriceBusd,
  } = farm
    
  return {
    isTokenOnly,
    lpAddress,
    lpSymbol,
    pid,
    multiplier,
    quoteTokenPriceBusd,
    tokenPriceBusd,
    token: deserializeToken(farm.token),
    quoteToken: deserializeToken(farm.quoteToken),
    userData: deserializeFarmUserData(farm),
    tokenAmountTotal: farm.tokenAmountTotal ? new BigNumber(farm.tokenAmountTotal) : BIG_ZERO,
    quoteTokenAmountTotal: farm.quoteTokenAmountTotal ? new BigNumber(farm.quoteTokenAmountTotal) : BIG_ZERO,
    lpTotalInQuoteToken: farm.lpTotalInQuoteToken ? new BigNumber(farm.lpTotalInQuoteToken) : BIG_ZERO,
    lpTotalSupply: farm.lpTotalSupply ? new BigNumber(farm.lpTotalSupply) : BIG_ZERO,
    lpTokenPrice: farm.lpTokenPrice ? new BigNumber(farm.lpTokenPrice) : BIG_ZERO,
    tokenPriceVsQuote: farm.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : BIG_ZERO,
    poolWeight: farm.poolWeight ? new BigNumber(farm.poolWeight) : BIG_ZERO,
    lpTokenStakedAmount: farm.lpTokenStakedAmount ? new BigNumber(farm.lpTokenStakedAmount) : BIG_ZERO,
  }
}
