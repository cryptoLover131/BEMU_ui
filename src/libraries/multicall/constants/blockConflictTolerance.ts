import { ChainId } from 'config/chains'

export const DEFAULT_BLOCK_CONFLICT_TOLERANCE = 0

export const BLOCK_CONFLICT_TOLERANCE: { [key in ChainId]?: number } = {
  [ChainId.BSC]: 3,
  [ChainId.ETHEREUM]: 1,
  [ChainId.ARBITRUM]: 5,
  [ChainId.POLYGON]: 1,
  [ChainId.SHIMMER]: 0
}
