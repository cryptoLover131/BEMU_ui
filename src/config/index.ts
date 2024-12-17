import { getFullDecimalMultiplier } from 'utils/getFullDecimalMultiplier'

export const SECONDS_PER_DAY = 60 * 60 * 24
export const SECONDS_PER_YEAR = SECONDS_PER_DAY * 365 // 10512000
export const BASE_URL = 'https://app.marvinonbase.com'
export const BASE_ADD_LIQUIDITY_URL = `${BASE_URL}/add`
export const DEFAULT_TOKEN_DECIMAL = getFullDecimalMultiplier(18)
export const DEFAULT_GAS_LIMIT = 1600000
export const BOOSTED_FARM_GAS_LIMIT = 3000000
export const AUCTION_BIDDERS_TO_FETCH = 500
export const RECLAIM_AUCTIONS_TO_FETCH = 500
export const AUCTION_WHITELISTED_BIDDERS_TO_FETCH = 500
export const IPFS_GATEWAY = 'https://ipfs.io/ipfs'
