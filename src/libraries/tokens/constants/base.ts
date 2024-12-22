import { ChainId } from 'config/chains'
import { ERC20Token, WETH9 } from 'libraries/swap-sdk'

export const baseTokens = {
  weth: WETH9[ChainId.BASE],
  usdc: new ERC20Token(
    ChainId.BASE,
    '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    6,
    'USDC',
    'USDCoin',
    '',
  ),
  dai: new ERC20Token(
    ChainId.BASE,
    '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
    18,
    'DAI',
    'Dai Stablecoin',
    '',
  ),
  bemu: new ERC20Token(
    ChainId.BASE,
    '0x2444b07c5b5B6d4EeFFfe9D62b4e7ebFae9Fa889',
    18,
    'BEMU',
    'BEMU',
    '',
  ),
}
