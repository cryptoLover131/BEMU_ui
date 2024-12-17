import {
  Currency,
  CurrencyAmount,
  Pair,
  Price,
  Token,
  WNATIVE,
  ERC20Token,
} from 'libraries/swap-sdk'
import { useReadContract } from 'wagmi'
import { lpTokenABI } from 'config/abi/lpTokenAbi'
import { BUSD, GTOKEN, USDC, USDT} from 'libraries/tokens'
import { useMemo } from 'react'
import getLpAddress from 'utils/getLpAddress'
import { multiplyPriceByAmount } from 'utils/prices'
import { useActiveChainId } from './useActiveChainId'
import { PairState, usePairs } from './usePairs'

/**
 * Returns the price in BUSD of the input currency
 * @param currency currency to compute the BUSD price of
 */
export default function useBUSDPrice(currency?: Currency): Price<Currency, Currency> | undefined {
  const { chainId } = useActiveChainId()
  const wrapped = currency?.wrapped
  const wnative = WNATIVE[chainId]
  const stable = USDC[chainId]

  const tokenPairs: [Currency | undefined, Currency | undefined][] = useMemo(
    () => [
      [chainId && wrapped && wnative?.equals(wrapped) ? undefined : currency, chainId ? wnative : undefined],
      [stable && wrapped?.equals(stable) ? undefined : wrapped, stable],
      [chainId ? wnative : undefined, stable],
    ],
    [wnative, stable, chainId, currency, wrapped],
  )
  const [[bnbPairState, bnbPair], [busdPairState, busdPair], [busdBnbPairState, busdBnbPair]] = usePairs(tokenPairs)

  return useMemo(() => {
    if (!currency || !wrapped || !chainId || !wnative) {
      return undefined
    }

    // handle busd
    if (wrapped.equals(stable)) {
      return new Price(stable, stable, '1', '1')
    }

    const isBUSDPairExist =
      busdPair &&
      busdPairState === PairState.EXISTS &&
      busdPair.reserve0.greaterThan('0') &&
      busdPair.reserve1.greaterThan('0')

    // handle wbnb/bnb
    if (wrapped.equals(wnative)) {
      if (isBUSDPairExist) {
        const price = busdPair.priceOf(wnative)
        return new Price(currency, stable, price.denominator, price.numerator)
      }
      return undefined
    }

    const isBnbPairExist =
      bnbPair &&
      bnbPairState === PairState.EXISTS &&
      bnbPair.reserve0.greaterThan('0') &&
      bnbPair.reserve1.greaterThan('0')
    const isBusdBnbPairExist =
      busdBnbPair &&
      busdBnbPairState === PairState.EXISTS &&
      busdBnbPair.reserve0.greaterThan('0') &&
      busdBnbPair.reserve1.greaterThan('0')

    const bnbPairBNBAmount = isBnbPairExist && bnbPair?.reserveOf(wnative)
    const bnbPairBNBBUSDValue =
      bnbPairBNBAmount && isBUSDPairExist && isBusdBnbPairExist
        ? busdBnbPair.priceOf(wnative).quote(bnbPairBNBAmount).quotient
        : 0n

    // all other tokens
    // first try the busd pair
    if (isBUSDPairExist && busdPair.reserveOf(stable).greaterThan(bnbPairBNBBUSDValue)) {
      const price = busdPair.priceOf(wrapped)
      return new Price(currency, stable, price.denominator, price.numerator)
    }
    if (isBnbPairExist && isBusdBnbPairExist) {
      if (busdBnbPair.reserveOf(stable).greaterThan('0') && bnbPair.reserveOf(wnative).greaterThan('0')) {
        const bnbBusdPrice = busdBnbPair.priceOf(stable)
        const currencyBnbPrice = bnbPair.priceOf(wnative)
        const busdPrice = bnbBusdPrice.multiply(currencyBnbPrice).invert()
        return new Price(currency, stable, busdPrice.denominator, busdPrice.numerator)
      }
    }

    return undefined
  }, [
    currency,
    wrapped,
    chainId,
    wnative,
    stable,
    bnbPair,
    busdBnbPair,
    busdPairState,
    busdPair,
    bnbPairState,
    busdBnbPairState,
  ])
}

export const usePriceByPairs = (currencyA?: Currency, currencyB?: Currency) => {
  const { chainId } = useActiveChainId()
  const [tokenA, tokenB] = [currencyA?.wrapped, currencyB?.wrapped]
  const pairAddress = getLpAddress(tokenA, tokenB)

  const { data: reserves } = useReadContract({
    query: {
      enabled: Boolean(pairAddress),
    },
    chainId,
    abi: lpTokenABI,
    address: pairAddress ?? undefined,
    functionName: 'getReserves',
  })

  if (!tokenA || !tokenB) return undefined

  const reserve0 = reserves?.[0]
  const reserve1 = reserves?.[1]

  const [token0, token1] = tokenA?.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]

  const pair = new Pair(
    CurrencyAmount.fromRawAmount(token0, reserve0?.toString() ?? token0 === tokenB ? "1" : "0"),
    CurrencyAmount.fromRawAmount(token1, reserve1?.toString() ?? token0 === tokenA ? "1" : "0"),
  )

  return pair.priceOf(tokenB)
}

export const useBUSDCurrencyAmount = (currency?: Currency, amount?: number): number | undefined => {
  const busdPrice = useBUSDPrice(currency)
  if (!amount) {
    return undefined
  }
  if (busdPrice) {
    return multiplyPriceByAmount(busdPrice, amount)
  }
  return undefined
}

export const useBUSDCakeAmount = (amount: number): number | undefined => {
  const cakeBusdPrice = useCakeBusdPrice()
  if (cakeBusdPrice) {
    return multiplyPriceByAmount(cakeBusdPrice, amount)
  }
  return undefined
}

// @Note: only fetch from one pair
export const useCakeBusdPrice = (): Price<ERC20Token, ERC20Token> | undefined => {
  const { chainId } = useActiveChainId()
  return usePriceByPairs(USDT[chainId], GTOKEN[chainId])
}

// @Note: only fetch from one pair
export const useBNBBusdPrice = (): Price<ERC20Token, ERC20Token> | undefined => {
  const { chainId } = useActiveChainId()
  const wnative: Token = WNATIVE[chainId]
  return usePriceByPairs(BUSD[chainId], wnative)
}
