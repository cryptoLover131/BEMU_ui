import { Abi, Address, erc20Abi } from 'viem'
import { useWalletClient } from 'wagmi'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useMemo } from 'react'
import { getMulticallAddress } from 'utils/addressHelpers'
import {
  getChainlinkOracleContract,
  getContract,
  getMasterChefContract,
  getMultisenderContract
} from 'utils/contractHelpers'

import { ChainId } from 'config/chains'
import { WNATIVE, pancakePairV2ABI } from 'libraries/swap-sdk'
import { GTOKEN } from 'libraries/tokens'
import { multicallABI } from 'config/abi/Multicall'
import { erc20Bytes32ABI } from 'config/abi/erc20_bytes32'
import { wethABI } from 'config/abi/weth'
/**
 * Helper hooks to get specific contracts (by ABI)
 */

export const useERC20 = (address?: Address, options?: UseContractOptions) => {
  return useContract(address, erc20Abi, options)
}

export const useCake = () => {
  const { chainId } = useActiveChainId()

  return useContract((chainId && GTOKEN[chainId]?.address) ?? GTOKEN[ChainId.BSC].address, erc20Abi)
}

export const useMasterchef = () => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getMasterChefContract(signer ?? undefined, chainId), [signer, chainId])
}

export const useChainlinkOracleContract = (address) => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getChainlinkOracleContract(address, signer ?? undefined), [signer, address])
}

// Code below migrated from Exchange useContract.ts

type UseContractOptions = {
  chainId?: ChainId
}

// returns null on errors
export function useContract<TAbi extends Abi>(
  addressOrAddressMap?: Address | { [chainId: number]: Address },
  abi?: TAbi,
  options?: UseContractOptions,
) {
  const { chainId: currentChainId } = useActiveChainId()
  const chainId = options?.chainId || currentChainId
  const { data: walletClient } = useWalletClient()

  return useMemo(() => {
    if (!addressOrAddressMap || !abi || !chainId) return null
    let address: Address | undefined
    if (typeof addressOrAddressMap === 'string') address = addressOrAddressMap
    else address = addressOrAddressMap[chainId]
    if (!address) return null
    try {
      return getContract({
        abi,
        address,
        chainId,
        signer: walletClient ?? undefined,
      })
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [addressOrAddressMap, abi, chainId, walletClient])
}

export function useTokenContract(tokenAddress?: Address) {
  return useContract(tokenAddress, erc20Abi)
}

export function useWNativeContract() {
  const { chainId } = useActiveChainId()
  return useContract(chainId ? WNATIVE[chainId]?.address : undefined, wethABI)
}

export function useBytes32TokenContract(tokenAddress?: Address) {
  return useContract(tokenAddress, erc20Bytes32ABI)
}

export function usePairContract(pairAddress?: Address, options?: UseContractOptions) {
  return useContract(pairAddress, pancakePairV2ABI, options)
}

export function useMulticallContract() {
  const { chainId } = useActiveChainId()
  return useContract(getMulticallAddress(chainId), multicallABI)
}

export const useMultisender = () => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getMultisenderContract(signer, chainId), [signer, chainId])
}