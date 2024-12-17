import { ChainId } from 'config/chains'

export default {
  masterChef: {
    [ChainId.BSC]: '0xa5f8C5Dbd5F286960b9d90548680aE5ebFf07652',
    [ChainId.ARBITRUM]: '0xAd55EDBeB57fDD66DB9789FE801E5dE8BB55149E',
  },
  multiCall: {
    [ChainId.ETHEREUM]: '0xcA11bde05977b3631167028862bE2a173976CA11',
    [ChainId.BASE]: '0xcA11bde05977b3631167028862bE2a173976CA11',
    [ChainId.BSC]: '0xcA11bde05977b3631167028862bE2a173976CA11',
    [ChainId.ARBITRUM]: '0xcA11bde05977b3631167028862bE2a173976CA11',
    [ChainId.POLYGON]: '0xcA11bde05977b3631167028862bE2a173976CA11',
    [ChainId.SHIMMER]: '0x272219571f9E6104960BE987f2462804fBD12551',
  },
  multisender: {
    42161: '0x5cce03fcbe62ac9d77b594201c5ccb7f952069e8'
  },
} as const satisfies Record<string, Record<number, `0x${string}`>>
