import BigNumber from 'bignumber.js'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { SLOW_INTERVAL } from 'config/constants'
import { SUPPORTED_CHAINS } from 'config/constants/supportChains'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useQuery } from '@tanstack/react-query'
import { getMasterChefContract } from 'utils/contractHelpers'
import { getFarmConfig } from 'libraries/farms/constants'
import { DeserializedFarm, DeserializedFarmsState, DeserializedFarmUserData } from 'libraries/farms'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { fetchFarmsPublicDataAsync, fetchFarmUserDataAsync } from '.'
import { State } from '../types'
import {
  farmFromLpSymbolSelector,
  farmSelector,
  makeBusdPriceFromPidSelector,
  makeFarmFromPidSelector,
  makeLpTokenPriceFromLpSymbolSelector,
  makeUserFarmFromPidSelector,
} from './selectors'

export function useFarmsLength() {
  const { chainId } = useActiveChainId()
  return useQuery({
    queryKey: ['farmsLength', chainId],
    queryFn: async () => {
      const mc = getMasterChefContract(undefined, chainId)
      return Number(await mc.read.poolLength())
    },
    enabled: Boolean(chainId && SUPPORTED_CHAINS.includes(chainId)),
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })
}

export function usePollFarmsWithUserData(): null {
  const dispatch = useAppDispatch()
  const { account, chainId } = useAccountActiveChain()

  useQuery({
    queryKey: ['publicFarmData', chainId],
    queryFn: async () => {
      if (!chainId) {
        throw new Error('ChainId is not defined')
      }
      const farmsConfig = await getFarmConfig(chainId)

      if (!farmsConfig) {
        throw new Error('Failed to fetch farm config')
      }
      const pids = farmsConfig.map((farmToFetch) => farmToFetch.pid)
      dispatch(fetchFarmsPublicDataAsync({ pids, chainId }))
      return null
    },
    enabled: Boolean(chainId && SUPPORTED_CHAINS.includes(chainId)),
    refetchInterval: SLOW_INTERVAL,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })

  const name = ['farmsWithUserData', account, chainId]

  useQuery({
    queryKey: name,

    queryFn: async () => {
      if (!chainId) {
        throw new Error('ChainId is not defined')
      }

      const farmsConfig = await getFarmConfig(chainId)

      if (!farmsConfig) {
        throw new Error('Failed to fetch farm config')
      }

      if (!account) {
        throw new Error('Invalid account')
      }
      const pids = farmsConfig.map((farmToFetch) => farmToFetch.pid)
      const params = { account, pids, chainId }
      dispatch(fetchFarmUserDataAsync(params))
      return null
    },
    enabled: Boolean(account && chainId),
    refetchInterval: SLOW_INTERVAL,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })

  return null
}

export const useFarms = (): DeserializedFarmsState => {
  const { chainId } = useActiveChainId()
  return useSelector(useMemo(() => farmSelector(chainId), [chainId]))
}

export const useFarmsPoolLength = (): number | undefined => {
  return useSelector((state: State) => state.farms.poolLength)
}

export const useFarmFromPid = (pid: number): DeserializedFarm | undefined => {
  const farmFromPid = useMemo(() => makeFarmFromPidSelector(pid), [pid])
  return useSelector(farmFromPid)
}

export const useFarmFromLpSymbol = (lpSymbol: string): DeserializedFarm | undefined => {
  const farmFromLpSymbol = useMemo(() => farmFromLpSymbolSelector(lpSymbol), [lpSymbol])
  return useSelector(farmFromLpSymbol)
}

export const useFarmUser = (pid): DeserializedFarmUserData => {
  const farmFromPidUser = useMemo(() => makeUserFarmFromPidSelector(pid), [pid])
  return useSelector(farmFromPidUser)
}

// Return the base token price for a farm, from a given pid
export const useBusdPriceFromPid = (pid: number): BigNumber | undefined => {
  const busdPriceFromPid = useMemo(() => makeBusdPriceFromPidSelector(pid), [pid])
  return useSelector(busdPriceFromPid)
}

export const useLpTokenPrice = (symbol: string, isTokenOnly?: boolean) => {
  const lpTokenPriceFromLpSymbol = useMemo(() => makeLpTokenPriceFromLpSymbolSelector(symbol, isTokenOnly), [symbol, isTokenOnly])
  return useSelector(lpTokenPriceFromLpSymbol)
}
