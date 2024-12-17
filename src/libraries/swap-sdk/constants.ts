import { ChainId } from 'config/chains'
import { Percent } from 'libraries/swap-sdk-core'
import { ERC20Token } from './entities/token'

export const ZERO_PERCENT = new Percent('0')
export const ONE_HUNDRED_PERCENT = new Percent('1')

export const FACTORY_ADDRESS = '0x8909Dc15e40173Ff4699343b6eB8132c65e18eC6'

export const FACTORY_ADDRESS_MAP: Record<number, `0x${string}`> = {
  [ChainId.ETHEREUM]: FACTORY_ADDRESS,
  [ChainId.ARBITRUM]: FACTORY_ADDRESS,
  [ChainId.BSC]: FACTORY_ADDRESS,
  [ChainId.POLYGON]: FACTORY_ADDRESS,
  [ChainId.SHIMMER]: FACTORY_ADDRESS,
  [ChainId.BASE]: FACTORY_ADDRESS,
}
export const INIT_CODE_HASH = '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f'

export const INIT_CODE_HASH_MAP: Record<number, `0x${string}`> = {
  [ChainId.ETHEREUM]: INIT_CODE_HASH,
  [ChainId.ARBITRUM]: INIT_CODE_HASH,
  [ChainId.BSC]: INIT_CODE_HASH,
  [ChainId.POLYGON]: INIT_CODE_HASH,
  [ChainId.SHIMMER]: INIT_CODE_HASH,
  [ChainId.BASE]: INIT_CODE_HASH,
}

export const WETH9 = {
  [ChainId.ETHEREUM]: new ERC20Token(
    ChainId.ETHEREUM,
    '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    18,
    'WETH',
    'Wrapped Ether',
    'https://weth.io'
  ),
  [ChainId.BASE]: new ERC20Token(
    ChainId.BASE,
    '0x4200000000000000000000000000000000000006',
    18,
    'WETH',
    'Wrapped Ether',
    'https://weth.io'
  ),
  [ChainId.ARBITRUM]: new ERC20Token(
    ChainId.ARBITRUM,
    '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    18,
    'WETH',
    'Wrapped Ether',
    'https://weth.io'
  ),
  [ChainId.POLYGON]: new ERC20Token(
    ChainId.POLYGON,
    '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
    18,
    'WMATIC',
    'Wrapped Matic',
    'https://polygon.technology/'
  ),
  [ChainId.SHIMMER]: new ERC20Token(
    ChainId.SHIMMER,
    '0xBEb654A116aeEf764988DF0C6B4bf67CC869D01b',
    18,
    'WSMR',
    'Wrapped Shimmer',
    ''
  ),
}

export const WBNB = {
  [ChainId.ETHEREUM]: new ERC20Token(
    ChainId.ETHEREUM,
    '0x418D75f65a02b3D53B2418FB8E1fe493759c7605',
    18,
    'WBNB',
    'Wrapped BNB',
    'https://www.binance.org'
  ),
  [ChainId.BSC]: new ERC20Token(
    ChainId.BSC,
    '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    18,
    'WBNB',
    'Wrapped BNB',
    'https://www.binance.org'
  ),
}

export const WNATIVE: Record<number, ERC20Token> = {
  [ChainId.ETHEREUM]: WETH9[ChainId.ETHEREUM],
  [ChainId.BASE]: WETH9[ChainId.BASE],
  [ChainId.ARBITRUM]: WETH9[ChainId.ARBITRUM],
  [ChainId.BSC]: WBNB[ChainId.BSC],
  [ChainId.POLYGON]: WETH9[ChainId.POLYGON],
  [ChainId.SHIMMER]: WETH9[ChainId.SHIMMER],
}

export const NATIVE: Record<
  number,
  {
    name: string
    symbol: string
    decimals: number
  }
> = {
  [ChainId.ETHEREUM]: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  [ChainId.BASE]: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  [ChainId.ARBITRUM]: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  [ChainId.POLYGON]: { name: 'Matic', symbol: 'MATIC', decimals: 18 },
  [ChainId.SHIMMER]: { name: 'Shimmer', symbol: 'SMR', decimals: 18 },
  [ChainId.BSC]: {
    name: 'Binance Chain Native Token',
    symbol: 'BNB',
    decimals: 18,
  },
}
