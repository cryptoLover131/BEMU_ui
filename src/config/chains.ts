import memoize from 'lodash/memoize'

import {
  Chain,
  mainnet,
  arbitrum,
  bsc,
  polygon,
  base
} from 'wagmi/chains'

export enum ChainId {
  ETHEREUM = 1,
  ARBITRUM = 42161,
  BSC = 56,
  POLYGON = 137,
  SHIMMER = 148,
  BASE = 8453
}

export const CHAIN_QUERY_NAME: Record<ChainId, string> = {
  [ChainId.ETHEREUM]: 'eth',
  [ChainId.BSC]: 'bsc',
  [ChainId.ARBITRUM]: 'arb',
  [ChainId.POLYGON]: 'polygon',
  [ChainId.SHIMMER]: 'shimmer',
  [ChainId.BASE]: 'base',
}

const CHAIN_QUERY_NAME_TO_ID = Object.entries(CHAIN_QUERY_NAME).reduce((acc, [chainId, chainName]) => {
  return {
    [chainName.toLowerCase()]: chainId as unknown as ChainId,
    ...acc,
  }
}, {} as Record<string, ChainId>)

export const CHAINS: [Chain, ...Chain[]] = [
  base
]

export const PUBLIC_NODES: Record<ChainId, string[] | readonly string[]> = {
  [ChainId.ETHEREUM]: [
    ...mainnet.rpcUrls.default.http,
    'https://ethereum.publicnode.com',
    'https://eth.llamarpc.com',
    'https://cloudflare-eth.com',
  ],
  [ChainId.ARBITRUM]: [
    ...arbitrum.rpcUrls.default.http,
    'https://arbitrum-one.publicnode.com',
    'https://arbitrum.llamarpc.com',
  ],
  [ChainId.BSC]: [
    ...bsc.rpcUrls.default.http,
    'https://bsc-dataseed1.defibit.io',
    'https://bsc-dataseed1.binance.org',
    'https://bsc.publicnode.com',
    'https://binance.llamarpc.com'
  ],
  [ChainId.POLYGON]: [
    ...polygon.rpcUrls.default.http,
  ],
  [ChainId.SHIMMER]: ['https://json-rpc.evm.shimmer.network'],
  [ChainId.BASE]: [
    ...base.rpcUrls.default.http,
  ],
}

export const getChainId = memoize((chainName: string) => {
  if (!chainName) return undefined
  return CHAIN_QUERY_NAME_TO_ID[chainName.toLowerCase()] ? +CHAIN_QUERY_NAME_TO_ID[chainName.toLowerCase()] : undefined
})