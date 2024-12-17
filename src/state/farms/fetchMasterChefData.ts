import { masterChefABI } from 'config/abi/masterchef'
import chunk from 'lodash/chunk'
import { notEmpty } from 'utils/notEmpty'
import { publicClient } from 'utils/wagmi'
import { SerializedFarm, SerializedFarmConfig } from 'libraries/farms'
import { getMasterChefAddress } from 'utils/addressHelpers'

export const fetchMasterChefFarmPoolLength = async (chainId: number) => {
  try {
    const client = publicClient({chainId})
    const poolLength = await client.readContract({
      abi: masterChefABI,
      functionName: 'poolLength',
      address: getMasterChefAddress(chainId),
    })

    return poolLength
  } catch (error) {
    console.error('Fetch MasterChef Farm Pool Length Error: ', error)
    return 0n
  }
}

export const fetchMasterChefTokenPerTime = async (chainId: number) => {
  try {
    const client = publicClient({chainId})
    const gtokenPerTime = await client.readContract({
      abi: masterChefABI,
      functionName: 'dkoPerTime',
      address: getMasterChefAddress(chainId),
    })

    return gtokenPerTime
  } catch (error) {
    console.error('Fetch MasterChef Token Per Time Error: ', error)
    return 0n
  }
}

const masterChefFarmCalls = (farm: SerializedFarm, chainId: number) => {
  const { pid } = farm
  const masterChefAddress = getMasterChefAddress(chainId)
  const masterChefPid = pid

  return masterChefPid || masterChefPid === 0
    ? [
        {
          abi: masterChefABI,
          address: masterChefAddress,
          functionName: 'poolInfo',
          args: [masterChefPid],
        },
        {
          abi: masterChefABI,
          address: masterChefAddress,
          functionName: 'totalAllocPoint',
        },
      ] as const
    : [null, null] as const
}

export const fetchMasterChefData = async (farms: SerializedFarmConfig[], chainId: number): Promise<any[]> => {
  const masterChefCalls = farms.map((farm) => masterChefFarmCalls(farm, chainId))
  const chunkSize = masterChefCalls.flat().length / farms.length
  const masterChefAggregatedCalls = masterChefCalls
    .filter((masterChefCall) => masterChefCall[0] !== null && masterChefCall[1] !== null)
    .flat()
    .filter(notEmpty)

  const client = publicClient({chainId})
  const masterChefMultiCallResult = await client.multicall({
    contracts: masterChefAggregatedCalls,
    allowFailure: false,
  })
  const masterChefChunkedResultRaw = chunk(masterChefMultiCallResult, chunkSize)

  let masterChefChunkedResultCounter = 0
  return masterChefCalls.map((masterChefCall) => {
    if (masterChefCall[0] === null && masterChefCall[1] === null) {
      return [null, null]
    }
    const data = masterChefChunkedResultRaw[masterChefChunkedResultCounter]
    masterChefChunkedResultCounter++
    return data
  })
}
