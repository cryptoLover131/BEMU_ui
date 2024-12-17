import { ChainId } from 'config/chains'
import { ERC20Token, WETH9 } from 'libraries/swap-sdk'
import { USDC, USDT, DAI_ARB, WBTC_ARB, GTOKEN, DCP, SDCP } from './common'

export const arbitrumTokens = { 
  weth: WETH9[ChainId.ARBITRUM],
  usdt: USDT[ChainId.ARBITRUM],
  usdc: USDC[ChainId.ARBITRUM],
  dai: DAI_ARB,
  wbtc: WBTC_ARB,
  gtoken: GTOKEN[ChainId.ARBITRUM],
  arb: new ERC20Token(
    ChainId.ARBITRUM,
    '0x912CE59144191C1204E64559FE8253a0e49E6548',
    18,
    'ARB',
    'Arbitrum',
  ),
  frax: new ERC20Token(
    ChainId.ARBITRUM,
    '0x17FC002b466eEc40DaE837Fc4bE5c67993ddBd6F',
    18,
    'FRAX',
    'Frax',
  ),
  test: new ERC20Token(
    ChainId.ARBITRUM,
    '0x095Fe4F968A0747c4ee8a569185131DDE086636e',
    18,
    'TEST',
    'TEST',
  ),
  dcp: DCP[ChainId.ARBITRUM],
  sdcp: SDCP[ChainId.ARBITRUM],
}
