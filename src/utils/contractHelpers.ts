import { GTOKEN } from 'libraries/tokens'

// Addresses
import {
  getMasterChefAddress,
  getMultiSenderAddress
} from 'utils/addressHelpers'

// ABI
import { ChainId } from 'config/chains'
import { chainlinkOracleABI } from 'config/abi/chainlinkOracle'
import { lpTokenABI } from 'config/abi/lpTokenAbi'
import { masterChefABI } from 'config/abi/masterchef'
import { viemClients } from 'utils/viem'
import {
  Abi,
  Address,
  GetContractReturnType,
  PublicClient,
  WalletClient,
  erc20Abi,
  getContract as viemGetContract,
} from 'viem'
import { multisenderABI } from 'config/abi/multisender'

export const getContract = <TAbi extends Abi | readonly unknown[], TWalletClient extends WalletClient>({
  abi,
  address,
  chainId = ChainId.BSC,
  publicClient,
  signer,
}: {
  abi: TAbi | readonly unknown[]
  address: Address
  chainId?: ChainId
  signer?: TWalletClient
  publicClient?: PublicClient
}) => {
  const c = viemGetContract({
    abi,
    address,
    client: {
      public: publicClient ?? viemClients[chainId],
      wallet: signer,
    },
  }) as unknown as GetContractReturnType<TAbi, PublicClient, Address>

  return {
    ...c,
    account: signer?.account,
    chain: signer?.chain,
  }
}

export const getErc20Contract = (address: Address, signer?: WalletClient) => {
  return getContract({ abi: erc20Abi, address, signer })
}

export const getLpContract = (address: Address, chainId?: number, signer?: WalletClient) => {
  return getContract({ abi: lpTokenABI, address, signer, chainId })
}

export const getGTokenContract = (chainId?: number) => {
  return getContract({
    abi: erc20Abi,
    address: chainId ? GTOKEN[chainId]?.address : GTOKEN[ChainId.BSC].address,
    chainId,
  })
}

export const getChainlinkOracleContract = (address: Address, signer?: WalletClient, chainId?: number) => {
  return getContract({ abi: chainlinkOracleABI, address, signer, chainId })
}

export const getMasterChefContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: masterChefABI,
    address: getMasterChefAddress(chainId),
    chainId,
    signer,
  })
}

export const getMultisenderContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({ abi: multisenderABI, address: getMultiSenderAddress(chainId), signer, chainId })
}