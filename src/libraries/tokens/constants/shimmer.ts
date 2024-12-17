import { ChainId } from 'config/chains'
import { WETH9, ERC20Token } from 'libraries/swap-sdk'
import { USDC, USDT, GTOKEN, WBTC_SMR } from './common'

export const shimmerTokens = {
  weth: WETH9[ChainId.SHIMMER],
  usdt: USDT[ChainId.SHIMMER],
  usdc: USDC[ChainId.SHIMMER],
  wbtc: WBTC_SMR,
  gtoken: GTOKEN[ChainId.SHIMMER],
  smr: new ERC20Token(
    ChainId.SHIMMER,
    '0x1074010000000000000000000000000000000000',
    6,
    'SMR',
    'Shimmer',
    'https://shimmer.network/',
  ),
  eth: new ERC20Token(
    ChainId.SHIMMER,
    '0x4638C9fb4eFFe36C49d8931BB713126063BF38f9',
    18,
    'ETH',
    'Ether',
    '',
  ),
  bnb: new ERC20Token(
    ChainId.SHIMMER,
    '0x2A6F394085B8E33fbD9dcFc776BCE4ed95F1900D',
    18,
    'BNB',
    'BNB'
  ),
  matic: new ERC20Token(
    ChainId.SHIMMER,
    '0xE6373A7Bb9B5a3e71D1761a6Cb4992AD8537Bf28',
    18,
    'MATIC',
    'Matic'
  ),
}
