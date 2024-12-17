import { ChainId } from "config/chains"

export const COINGECKO = 'https://tokens.pancakeswap.finance/coingecko.json'
export const UNISWAP = 'https://cloudflare-ipfs.com/ipns/tokens.uniswap.org'
export const CMC = 'https://tokens.pancakeswap.finance/cmc.json'

// List of official tokens list
export const OFFICIAL_LISTS = []

export const UNSUPPORTED_LIST_URLS: string[] = []
export const WARNING_LIST_URLS: string[] = []

// lower index == higher priority for token import
export const DEFAULT_LIST_OF_LISTS: string[] = []

// default lists to be 'active' aka searched across
export const DEFAULT_ACTIVE_LIST_URLS: string[] = []

export const MULTI_CHAIN_LIST_URLS: { [chainId: number]: string[] } = {
    [ChainId.BSC]: [],
    [ChainId.ETHEREUM]: [],
    [ChainId.POLYGON]: [],
    [ChainId.ARBITRUM]: [],
    [ChainId.SHIMMER]: [],
  }
