import BigNumber from 'bignumber.js'
import { BIG_ONE, BIG_TWO, BIG_ZERO } from 'utils/bigNumber'
import { filterFarmsByQuoteToken, SerializedFarm } from 'libraries/farms'
import { ChainId } from 'config/chains'
import { getBalanceAmount } from 'utils/formatBalance'

const getFarmFromTokenSymbol = (
  farms: SerializedFarm[],
  tokenSymbol: string,
  preferredQuoteTokens?: string[],
): SerializedFarm => {
  const farmsWithTokenSymbol = farms.filter((farm) => farm.token.symbol === tokenSymbol)
  const filteredFarm = filterFarmsByQuoteToken(farmsWithTokenSymbol, preferredQuoteTokens)
  return filteredFarm
}

const getFarmBaseTokenPrice = (
  farm: SerializedFarm | null,
  quoteTokenFarm: SerializedFarm | null,
  nativePriceUSD: BigNumber,
  wNative: string,
  stable: string,
): BigNumber => {
  const hasTokenPriceVsQuote = Boolean(farm?.tokenPriceVsQuote)

  if (farm?.quoteToken.symbol === stable) {
    return hasTokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote || '0') : BIG_ZERO
  }

  if (farm?.quoteToken.symbol === wNative) {
    return hasTokenPriceVsQuote ? nativePriceUSD.times(farm.tokenPriceVsQuote || '0') : BIG_ZERO
  }

  // We can only calculate profits without a quoteTokenFarm for BUSD/BNB farms
  if (!quoteTokenFarm) {
    return BIG_ZERO
  }

  // Possible alternative farm quoteTokens:
  // UST (i.e. MIR-UST), pBTC (i.e. PNT-pBTC), BTCB (i.e. bBADGER-BTCB), ETH (i.e. SUSHI-ETH)
  // If the farm's quote token isn't BUSD or WBNB, we then use the quote token, of the original farm's quote token
  // i.e. for farm PNT - pBTC we use the pBTC farm's quote token - BNB, (pBTC - BNB)
  // from the BNB - pBTC price, we can calculate the PNT - BUSD price
  if (quoteTokenFarm.quoteToken.symbol === wNative) {
    const quoteTokenInBusd = nativePriceUSD.times(quoteTokenFarm.tokenPriceVsQuote!)
    return hasTokenPriceVsQuote && quoteTokenInBusd
      ? new BigNumber(farm?.tokenPriceVsQuote || '0').times(quoteTokenInBusd)
      : BIG_ZERO
  }

  if (quoteTokenFarm.quoteToken.symbol === stable) {
    const quoteTokenInBusd = quoteTokenFarm.tokenPriceVsQuote
    return hasTokenPriceVsQuote && quoteTokenInBusd
      ? new BigNumber(farm?.tokenPriceVsQuote || '0').times(quoteTokenInBusd)
      : BIG_ZERO
  }

  // Catch in case token does not have immediate or once-removed BUSD/WBNB quoteToken
  return BIG_ZERO
}

const getFarmQuoteTokenPrice = (
  farm: SerializedFarm | null,
  quoteTokenFarm: SerializedFarm | null,
  nativePriceUSD: BigNumber,
  wNative: string,
  stable: string,
): BigNumber => {
  if (farm?.quoteToken.symbol === stable) {
    return BIG_ONE
  }

  if (farm?.quoteToken.symbol === wNative) {
    return nativePriceUSD
  }

  if (!quoteTokenFarm) {
    return BIG_ZERO
  }

  if (quoteTokenFarm.quoteToken.symbol === wNative) {
    return quoteTokenFarm.tokenPriceVsQuote ? nativePriceUSD.times(quoteTokenFarm.tokenPriceVsQuote) : BIG_ZERO
  }

  if (quoteTokenFarm.quoteToken.symbol === stable) {
    return quoteTokenFarm.tokenPriceVsQuote ? new BigNumber(quoteTokenFarm.tokenPriceVsQuote) : BIG_ZERO
  }

  return BIG_ZERO
}

const getLpTokenPrice = (
  farm: SerializedFarm,
  tokenPriceBusd: BigNumber,
) => {
  // LP token price
  let lpTokenPrice = BIG_ZERO
  const lpTotalSupply = farm.lpTotalSupply ? new BigNumber(farm.lpTotalSupply) : BIG_ZERO
  const lpTotalInQuoteToken = farm.lpTotalInQuoteToken ? new BigNumber(farm.lpTotalInQuoteToken) : BIG_ZERO
  if (lpTotalSupply.gt(0) && lpTotalInQuoteToken.gt(0)) {
    const tokenAmountTotal = farm.tokenAmountTotal ? new BigNumber(farm.tokenAmountTotal) : BIG_ZERO
    const valueOfBaseTokenInFarm = tokenPriceBusd.times(tokenAmountTotal)
    // Double it to get overall value in LP
    const overallValueOfAllTokensInFarm = valueOfBaseTokenInFarm.times(BIG_TWO)
    // Divide total value of all tokens, by the number of LP tokens
    const totalLpTokens = getBalanceAmount(lpTotalSupply);
    // const totalLpTokens = lpTotalSupply.dividedBy(FixedNumber.from(getFullDecimalMultiplier(decimals)))
    lpTokenPrice = farm.isTokenOnly ? new BigNumber(farm?.tokenPriceBusd || '0') : overallValueOfAllTokensInFarm.div(totalLpTokens)
  }

  return lpTokenPrice
}

const getFarmsPrices = (farms: SerializedFarm[], chainId: number) => {
  if (!nativeStableLpMap[chainId]) {
    throw new Error(`chainId ${chainId} not supported`)
  }

  const nativeStableFarm = farms.find(
    (farm) => farm.lpAddress.toLowerCase() === nativeStableLpMap[chainId].address.toLowerCase(),
  )
  const nativePriceUSD = nativeStableFarm?.tokenPriceVsQuote ? BIG_ONE.div(nativeStableFarm?.tokenPriceVsQuote || '0') : BIG_ZERO
  const farmsWithPrices = farms.map((farm) => {
    const { wNative, stable } = nativeStableLpMap[chainId]
    const quoteTokenFarm = farm.isTokenOnly ? farms.filter((farm1) => farm1.pid === 2)[0] : (
      farm.quoteToken.symbol !== stable && farm.quoteToken.symbol !== wNative
        ? getFarmFromTokenSymbol(farms, farm.quoteToken.symbol, [wNative, stable])
        : null)
    const tokenPriceBusd = farm.isTokenOnly ? new BigNumber(quoteTokenFarm?.tokenPriceVsQuote || '0') : getFarmBaseTokenPrice(farm, quoteTokenFarm, nativePriceUSD, wNative, stable)
    const quoteTokenPriceBusd = getFarmQuoteTokenPrice(farm, quoteTokenFarm, nativePriceUSD, wNative, stable)
    const lpTokenPriceBusd = farm.isTokenOnly ? new BigNumber(quoteTokenFarm?.tokenPriceVsQuote || '0') : getLpTokenPrice(farm, tokenPriceBusd)

    return {
      ...farm,
      tokenPriceBusd: tokenPriceBusd.toJSON(),
      quoteTokenPriceBusd: quoteTokenPriceBusd.toJSON(),
      lpTokenPrice: lpTokenPriceBusd.toJSON(),
    }
  })

  return farmsWithPrices
}

export default getFarmsPrices

const nativeStableLpMap = {
  [ChainId.ETHEREUM]: {
    address: '0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852',
    wNative: 'WETH',
    stable: 'USDT',
  },
  [ChainId.BSC]: {
    address: '0x8E3084D1F7246BD63f8df09eCa075B738C757696',
    wNative: 'WBNB',
    stable: 'USDT',
  },
  [ChainId.ARBITRUM]: {
    address: '0xd04Bc65744306A5C149414dd3CD5c984D9d3470d',
    wNative: 'WETH',
    stable: 'USDT',
  },
  [ChainId.POLYGON]: {
    address: '0x6D65adF782C202788b1814E39cad2221547C1900',
    wNative: 'WMATIC',
    stable: 'USDT',
  },
  [ChainId.SHIMMER]: {
    address: '0x4fc33da508423be75becb7dc735811169d748bb6',
    wNative: 'SMR',
    stable: 'USDT',
  },
}
