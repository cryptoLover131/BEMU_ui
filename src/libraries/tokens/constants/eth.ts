import { ChainId } from 'config/chains'
import { WETH9 } from 'libraries/swap-sdk'
import { DAI_ETH, GTOKEN, USDC, USDT, WBTC_ETH } from './common'

export const ethereumTokens = {
  weth: WETH9[ChainId.ETHEREUM],
  usdt: USDT[ChainId.ETHEREUM],
  usdc: USDC[ChainId.ETHEREUM],
  wbtc: WBTC_ETH,
  dai: DAI_ETH,
  noi: GTOKEN[ChainId.ETHEREUM]
}
