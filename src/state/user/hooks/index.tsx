import { ChainId } from 'config/chains'
import { getFarmConfig } from 'libraries/farms/constants'
import { ERC20Token, Pair } from 'libraries/swap-sdk'
import { deserializeToken } from 'libraries/token-lists'
import { useQuery } from '@tanstack/react-query'
import { BASES_TO_TRACK_LIQUIDITY_FOR, PINNED_PAIRS } from 'config/constants/exchange'
import { useOfficialsAndUserAddedTokens } from 'hooks/Tokens'
import { useActiveChainId } from 'hooks/useActiveChainId'
import flatMap from 'lodash/flatMap'
import { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { AppState, useAppDispatch } from 'state'
import { safeGetAddress } from 'utils'
import { Hex, hexToBigInt } from 'viem'
import { useWalletClient } from 'wagmi'
import { useFeeData } from 'libraries/wagmi'
import { GAS_PRICE_GWEI } from '../../types'
import {
  FarmStakedOnly,
  SerializedPair,
  ViewMode,
  addSerializedPair,
  addSerializedToken,
  addWatchlistPool,
  addWatchlistToken,
  removeSerializedToken,
  setSubgraphHealthIndicatorDisplayed,
  updateGasPrice,
  updateUserFarmStakedOnly,
  updateUserFarmsViewMode,
  updateUserPoolStakedOnly,
  updateUserPoolsViewMode,
  updateUserSlippageTolerance,
} from '../actions'
import { useUserChart } from './useUserChart'

// Get user preference for exchange price chart
// For mobile layout chart is hidden by default
export function useExchangeChartManager(isMobile: boolean) {
  return useUserChart(isMobile)
}

export function useSubgraphHealthIndicatorManager() {
  const dispatch = useAppDispatch()
  const isSubgraphHealthIndicatorDisplayed = useSelector<
    AppState,
    AppState['user']['isSubgraphHealthIndicatorDisplayed']
  >((state) => state.user.isSubgraphHealthIndicatorDisplayed)

  const setSubgraphHealthIndicatorDisplayedPreference = useCallback(
    (newIsDisplayed: boolean) => {
      dispatch(setSubgraphHealthIndicatorDisplayed(newIsDisplayed))
    },
    [dispatch],
  )

  return [isSubgraphHealthIndicatorDisplayed, setSubgraphHealthIndicatorDisplayedPreference] as const
}

export function useUserSlippageTolerance(): [number, (slippage: number) => void] {
  const dispatch = useAppDispatch()
  const userSlippageTolerance = useSelector<AppState, AppState['user']['userSlippageTolerance']>((state) => {
    return state.user.userSlippageTolerance
  })

  const setUserSlippageTolerance = useCallback(
    (slippage: number) => {
      dispatch(updateUserSlippageTolerance({ userSlippageTolerance: slippage }))
    },
    [dispatch],
  )

  return [userSlippageTolerance, setUserSlippageTolerance]
}

export function useUserFarmStakedOnly(isActive: boolean): [boolean, (stakedOnly: boolean) => void] {
  const dispatch = useAppDispatch()
  const userFarmStakedOnly = useSelector<AppState, AppState['user']['userFarmStakedOnly']>((state) => {
    return state.user.userFarmStakedOnly
  })

  const setUserFarmStakedOnly = useCallback(
    (stakedOnly: boolean) => {
      const farmStakedOnly = stakedOnly ? FarmStakedOnly.TRUE : FarmStakedOnly.FALSE
      dispatch(updateUserFarmStakedOnly({ userFarmStakedOnly: farmStakedOnly }))
    },
    [dispatch],
  )

  return [
    userFarmStakedOnly === FarmStakedOnly.ON_FINISHED ? !isActive : userFarmStakedOnly === FarmStakedOnly.TRUE,
    setUserFarmStakedOnly,
  ]
}

export function useUserPoolStakedOnly(): [boolean, (stakedOnly: boolean) => void] {
  const dispatch = useAppDispatch()
  const userPoolStakedOnly = useSelector<AppState, AppState['user']['userPoolStakedOnly']>((state) => {
    return state.user.userPoolStakedOnly
  })

  const setUserPoolStakedOnly = useCallback(
    (stakedOnly: boolean) => {
      dispatch(updateUserPoolStakedOnly({ userPoolStakedOnly: stakedOnly }))
    },
    [dispatch],
  )

  return [userPoolStakedOnly, setUserPoolStakedOnly]
}

export function useUserPoolsViewMode(): [ViewMode, (viewMode: ViewMode) => void] {
  const dispatch = useAppDispatch()
  const userPoolsViewMode = useSelector<AppState, AppState['user']['userPoolsViewMode']>((state) => {
    return state.user.userPoolsViewMode
  })

  const setUserPoolsViewMode = useCallback(
    (viewMode: ViewMode) => {
      dispatch(updateUserPoolsViewMode({ userPoolsViewMode: viewMode }))
    },
    [dispatch],
  )

  return [userPoolsViewMode, setUserPoolsViewMode]
}

export function useUserFarmsViewMode(): [ViewMode, (viewMode: ViewMode) => void] {
  const dispatch = useAppDispatch()
  const userFarmsViewMode = useSelector<AppState, AppState['user']['userFarmsViewMode']>((state) => {
    return state.user.userFarmsViewMode
  })

  const setUserFarmsViewMode = useCallback(
    (viewMode: ViewMode) => {
      dispatch(updateUserFarmsViewMode({ userFarmsViewMode: viewMode }))
    },
    [dispatch],
  )

  return [userFarmsViewMode, setUserFarmsViewMode]
}

export function useAddUserToken(): (token: ERC20Token) => void {
  const dispatch = useAppDispatch()
  return useCallback(
    (token: ERC20Token) => {
      dispatch(addSerializedToken({ serializedToken: token.serialize }))
    },
    [dispatch],
  )
}

export function useRemoveUserAddedToken(): (chainId: number, address: string) => void {
  const dispatch = useAppDispatch()
  return useCallback(
    (chainId: number, address: string) => {
      dispatch(removeSerializedToken({ chainId, address }))
    },
    [dispatch],
  )
}

export function useFeeDataWithGasPrice(chainIdOverride?: number): {
  gasPrice?: bigint
  maxFeePerGas?: bigint
  maxPriorityFeePerGas?: bigint
} {
  const { chainId: chainId_ } = useActiveChainId()
  const chainId = chainIdOverride ?? chainId_

  const gasPrice = useGasPrice(chainId)
  const { data } = useFeeData({
    chainId,
    query: {
      enabled: chainId !== ChainId.BSC,
    },
    watch: true,
  })

  if (gasPrice) {
    return {
      gasPrice,
    }
  }

  return {
    gasPrice: data?.gasPrice ?? undefined,
    maxFeePerGas: data?.maxFeePerGas ?? undefined,
    maxPriorityFeePerGas: data?.maxPriorityFeePerGas ?? undefined,
  }
}

const DEFAULT_BSC_GAS_BIGINT = BigInt(GAS_PRICE_GWEI.default)
/**
 * Note that this hook will only works well for BNB chain
 */
export function useGasPrice(chainIdOverride?: number): bigint | undefined {
  const { chainId: chainId_ } = useActiveChainId()
  const chainId = chainIdOverride ?? chainId_
  const { data: signer } = useWalletClient({ chainId })
  const userGas = useSelector<AppState, AppState['user']['gasPrice']>((state) => state.user.gasPrice)
  const { data: bscProviderGasPrice = DEFAULT_BSC_GAS_BIGINT } = useQuery({
    queryKey: ['bscProviderGasPrice', signer],

    queryFn: async () => {
      // @ts-ignore
      const gasPrice = await signer?.request({
        method: 'eth_gasPrice' as any,
      })
      return hexToBigInt(gasPrice as Hex)
    },

    enabled: Boolean(signer && chainId === ChainId.BSC && userGas === GAS_PRICE_GWEI.rpcDefault),
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })
  if (chainId === ChainId.BSC) {
    return userGas === GAS_PRICE_GWEI.rpcDefault ? bscProviderGasPrice : BigInt(userGas ?? GAS_PRICE_GWEI.default)
  }
  return undefined
}

export function useGasPriceManager(): [string, (userGasPrice: string) => void] {
  const dispatch = useAppDispatch()
  const userGasPrice = useSelector<AppState, AppState['user']['gasPrice']>((state) => state.user.gasPrice)

  const setGasPrice = useCallback(
    (gasPrice: string) => {
      dispatch(updateGasPrice({ gasPrice }))
    },
    [dispatch],
  )

  return [userGasPrice, setGasPrice]
}

function serializePair(pair: Pair): SerializedPair {
  return {
    token0: pair.token0.serialize,
    token1: pair.token1.serialize,
  }
}

export function usePairAdder(): (pair: Pair) => void {
  const dispatch = useAppDispatch()

  return useCallback(
    (pair: Pair) => {
      dispatch(addSerializedPair({ serializedPair: serializePair(pair) }))
    },
    [dispatch],
  )
}

/**
 * Given two tokens return the liquidity token that represents its liquidity shares
 * @param tokenA one of the two tokens
 * @param tokenB the other token
 */
export function toV2LiquidityToken([tokenA, tokenB]: [ERC20Token, ERC20Token]): ERC20Token {
  return new ERC20Token(tokenA.chainId, Pair.getAddress(tokenA, tokenB), 18, 'Cake-LP', 'Pancake LPs')
}

/**
 * Returns all the pairs of tokens that are tracked by the user for the current chain ID.
 */
export function useTrackedTokenPairs(): [ERC20Token, ERC20Token][] {
  const { chainId } = useActiveChainId()
  const tokens = useOfficialsAndUserAddedTokens()

  // pinned pairs
  const pinnedPairs = useMemo(() => (chainId ? PINNED_PAIRS[chainId] ?? [] : []), [chainId])

  const { data: farmPairs = [] } = useQuery({
    queryKey: ['track-farms-pairs', chainId],

    queryFn: async () => {
      const farms = await getFarmConfig(chainId)

      const fPairs: [ERC20Token, ERC20Token][] | undefined = farms
        ?.filter((farm) => farm.pid !== 0)
        ?.map((farm) => [deserializeToken(farm.token), deserializeToken(farm.quoteToken)])

      return fPairs
    },

    enabled: Boolean(chainId),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })

  // pairs for every token against every base
  const generatedPairs: [ERC20Token, ERC20Token][] = useMemo(
    () =>
      chainId
        ? flatMap(Object.keys(tokens), (tokenAddress) => {
            const token = tokens[tokenAddress]
            // for each token on the current chain,
            return (
              // loop through all bases on the current chain
              (BASES_TO_TRACK_LIQUIDITY_FOR[chainId] ?? [])
                // to construct pairs of the given token with each base
                .map((base: any) => {
                  const baseAddress = safeGetAddress(base.address)

                  if (baseAddress && baseAddress === tokenAddress) {
                    return null
                  }
                  return [base, token]
                })
                .filter((p: any): p is [ERC20Token, ERC20Token] => p !== null)
            )
          })
        : [],
    [tokens, chainId],
  )

  // pairs saved by users
  const savedSerializedPairs = useSelector<AppState, AppState['user']['pairs']>(({ user: { pairs } }) => pairs)

  const userPairs: [ERC20Token, ERC20Token][] = useMemo(() => {
    if (!chainId || !savedSerializedPairs) return []
    const forChain = savedSerializedPairs[chainId]
    if (!forChain) return []

    return Object.keys(forChain).map((pairId) => {
      return [deserializeToken(forChain[pairId].token0), deserializeToken(forChain[pairId].token1)]
    })
  }, [savedSerializedPairs, chainId])

  const combinedList = useMemo(
    () => userPairs.concat(generatedPairs).concat(pinnedPairs).concat(farmPairs),
    [generatedPairs, pinnedPairs, userPairs, farmPairs],
  )

  return useMemo(() => {
    // dedupes pairs of tokens in the combined list
    const keyed = combinedList.reduce<{
      [key: string]: [ERC20Token, ERC20Token]
    }>((memo, [tokenA, tokenB]) => {
      const sorted = tokenA.sortsBefore(tokenB)
      const key = sorted
        ? `${safeGetAddress(tokenA.address)}:${safeGetAddress(tokenB.address)}`
        : `${safeGetAddress(tokenB.address)}:${safeGetAddress(tokenA.address)}`
      if (memo[key]) return memo
      memo[key] = sorted ? [tokenA, tokenB] : [tokenB, tokenA]
      return memo
    }, {})

    return Object.keys(keyed).map((key) => keyed[key])
  }, [combinedList])
}

export const useWatchlistTokens = (): [string[], (address: string) => void] => {
  const dispatch = useAppDispatch()
  const savedTokensFromSelector = useSelector((state: AppState) => state.user.watchlistTokens)
  const updatedSavedTokens = useCallback(
    (address: string) => {
      dispatch(addWatchlistToken({ address }))
    },
    [dispatch],
  )
  const savedTokens = useMemo(() => {
    return savedTokensFromSelector ?? []
  }, [savedTokensFromSelector])
  return [savedTokens, updatedSavedTokens]
}

export const useWatchlistPools = (): [string[], (address: string) => void] => {
  const dispatch = useAppDispatch()
  const savedPoolsFromSelector = useSelector((state: AppState) => state.user.watchlistPools)
  const updateSavedPools = useCallback(
    (address: string) => {
      dispatch(addWatchlistPool({ address }))
    },
    [dispatch],
  )
  const savedPools = useMemo(() => {
    return savedPoolsFromSelector ?? []
  }, [savedPoolsFromSelector])
  return [savedPools, updateSavedPools]
}
