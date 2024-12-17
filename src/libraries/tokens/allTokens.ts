import { ChainId } from 'config/chains'

import { ethereumTokens } from './constants/eth'
import { arbitrumTokens } from './constants/arb'
import { bscTokens } from './constants/bsc'
import { polygonTokens } from './constants/polygon'
import { shimmerTokens } from './constants/shimmer'

export const allTokens = {
  [ChainId.ETHEREUM]: ethereumTokens,
  [ChainId.ARBITRUM]: arbitrumTokens,
  [ChainId.BSC]: bscTokens,
  [ChainId.POLYGON]: polygonTokens,
  [ChainId.SHIMMER]: shimmerTokens,
}
