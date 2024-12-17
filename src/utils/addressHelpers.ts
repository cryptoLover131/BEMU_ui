import { ChainId } from 'config/chains'
import addresses from 'config/constants/contracts'
import { Address } from 'viem'

export type Addresses = {
  [chainId in ChainId]?: Address
}

export const getAddressFromMap = (address: Addresses, chainId?: number): `0x${string}` => {
  return chainId && address[chainId] ? address[chainId] : address[ChainId.BSC]
}

export const getAddressFromMapNoFallback = (address: Addresses, chainId?: number): `0x${string}` | null => {
  return chainId ? address[chainId] : null
}

export const getMasterChefAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.masterChef, chainId)
}
export const getMulticallAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.multiCall, chainId)
}

export const getMultiSenderAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.multisender, chainId)
}
