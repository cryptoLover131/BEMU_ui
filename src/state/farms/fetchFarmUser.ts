import BigNumber from 'bignumber.js'
import { erc20Abi , Address } from 'viem'
import { masterChefABI } from 'config/abi/masterchef'
import { publicClient } from 'utils/wagmi'
import { getMasterChefAddress } from 'utils/addressHelpers'
import { SerializedFarmConfig } from 'libraries/farms'

export const fetchFarmUserAllowances = async (
  account: Address,
  farmsToFetch: SerializedFarmConfig[],
  chainId: number,
) => {
  const masterChefAddress = getMasterChefAddress(chainId)

  const calls = farmsToFetch.map((farm) => {
    const lpContractAddress = farm.lpAddress
    return { 
      address: lpContractAddress, 
      functionName: 'allowance', 
      abi: erc20Abi,
      args: [account, masterChefAddress], 
    } as const
  })

  const client = publicClient({chainId})

  const rawLpAllowances = await client.multicall({ contracts: calls, allowFailure: false })

  const parsedLpAllowances = rawLpAllowances.map((lpBalance) => {
    return new BigNumber(lpBalance.toString()).toJSON()
  })

  return parsedLpAllowances
}

export const fetchFarmUserTokenBalances = async (
  account: string,
  farmsToFetch: SerializedFarmConfig[],
  chainId: number,
) => {
  const calls = farmsToFetch.map((farm) => {
    const lpContractAddress = farm.lpAddress
    return {
      address: lpContractAddress,
      functionName: 'balanceOf',
      abi: erc20Abi,
      args: [account as Address] as const,
    } as const
  })

  const client = publicClient({ chainId })

  const rawTokenBalances = await client.multicall({ contracts: calls, allowFailure: false })
  const parsedTokenBalances = rawTokenBalances.map((tokenBalance) => {
    return new BigNumber(tokenBalance.toString()).toJSON()
  })
  return parsedTokenBalances
}

export const fetchFarmUserStakedBalances = async (
  account: string,
  farmsToFetch: SerializedFarmConfig[],
  chainId: number,
) => {
  const masterChefAddress = getMasterChefAddress(chainId)

  const calls = farmsToFetch.map((farm) => {
    return {
      address: masterChefAddress,
      functionName: 'userInfo',
      abi: masterChefABI,
      args: [BigInt(farm.pid), account as Address] as const,
    } as const
  })

  const client = publicClient({ chainId })

  const rawStakedBalances = await client.multicall({
    contracts: calls,
    allowFailure: false
  })
  const parsedStakedBalances = rawStakedBalances.map((stakedBalance) => {
    return new BigNumber(stakedBalance[0].toString()).toJSON()
  })
  return parsedStakedBalances
}

export const fetchFarmUserEarnings = async (account: string, farmsToFetch: SerializedFarmConfig[], chainId: number) => {
  const userAddress = account
  const masterChefAddress = getMasterChefAddress(chainId)

  const calls = farmsToFetch.map((farm) => {
    return {
      address: masterChefAddress,
      functionName: 'pendingDKO',
      abi: masterChefABI,
      args: [BigInt(farm.pid), userAddress as Address] as const,
    } as const
  })

  const client = publicClient({chainId})

  const rawEarnings = await client.multicall({ contracts: calls, allowFailure: false })
  const parsedEarnings = rawEarnings.map((earnings) => {
    return new BigNumber(earnings.toString()).toJSON()
  })
  return parsedEarnings
}
