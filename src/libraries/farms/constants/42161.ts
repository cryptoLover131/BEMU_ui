import { arbitrumTokens } from 'libraries/tokens'
import { SerializedFarmConfig } from '..'

const farms: SerializedFarmConfig[] = [
  {
    pid: 0,
    lpSymbol: 'DKO',
    lpAddress: '0xcBC8e435993af38950a708Be002e1A6d1280132B',
    quoteToken: arbitrumTokens.usdt,
    token: arbitrumTokens.gtoken,
    isTokenOnly: true,
  },
  {
    pid: 1,
    lpSymbol: 'DKO-ETH LP',
    lpAddress: '0xF87d2ead5b82aa36A031d446d8622F6A2e959b53',
    quoteToken: arbitrumTokens.weth,
    token: arbitrumTokens.gtoken,
  },
  {
    pid: 2,
    lpSymbol: 'DKO-USDT LP',
    lpAddress: '0x0F3090Ef6eb6eCcB2F3b93377E00826D2116351E',
    quoteToken: arbitrumTokens.usdt,
    token: arbitrumTokens.gtoken,
  },
  {
    pid: 3,
    lpSymbol: 'DKO-USDC LP',
    lpAddress: '0x30d6382FA94EfD5DC81D915b2d669d2546a88173',
    quoteToken: arbitrumTokens.usdc,
    token: arbitrumTokens.gtoken,
  },
  {
    pid: 4,
    lpSymbol: 'DKO-DAI LP',
    lpAddress: '0xf4A855eCb147fD654A3c2d3A18EE01F5A347d5E4',
    quoteToken: arbitrumTokens.dai,
    token: arbitrumTokens.gtoken,
  },
  {
    pid: 5,
    lpSymbol: 'ETH-USDT LP',
    lpAddress: '0xd04Bc65744306A5C149414dd3CD5c984D9d3470d',
    quoteToken: arbitrumTokens.weth,
    token: arbitrumTokens.usdt,
  },
  {
    pid: 6,
    lpSymbol: 'ETH-USDC LP',
    lpAddress: '0xF64Dfe17C8b87F012FCf50FbDA1D62bfA148366a',
    quoteToken: arbitrumTokens.weth,
    token: arbitrumTokens.usdc,
  },
  {
    pid: 7,
    lpSymbol: 'USDT-USDC LP',
    lpAddress: '0xDeae1ff5282D83AAdd42f85c57F6e69a037bf7Cd',
    quoteToken: arbitrumTokens.usdt,
    token: arbitrumTokens.usdc,
  },
  {
    pid: 8,
    lpSymbol: 'USDC-DAI LP',
    lpAddress: '0x8edd9aEABdf2e63f76f4c4B7F36AEFa14D3cC6BC',
    quoteToken: arbitrumTokens.usdc,
    token: arbitrumTokens.dai,
  },
  {
    pid: 9,
    lpSymbol: 'ETH-ARB LP',
    lpAddress: '0x103B03051Bf073c44DECfAF8dFd12275254AB97E',
    quoteToken: arbitrumTokens.weth,
    token: arbitrumTokens.arb,
  },
  {
    pid: 10,
    lpSymbol: 'USDC-ARB LP',
    lpAddress: '0x011f31D20C8778c8Beb1093b73E3A5690Ee6271b',
    quoteToken: arbitrumTokens.usdc,
    token: arbitrumTokens.arb,
  },
  {
    pid: 11,
    lpSymbol: 'USDT-ARB LP',
    lpAddress: '0x53d461D05fd85499a9C2b1FDFB8A12bE496C0265',
    quoteToken: arbitrumTokens.usdt,
    token: arbitrumTokens.arb,
  },
].map((p) => ({ ...p, lpAddress: p.lpAddress as `0x${string}`, token: p.token.serialize, quoteToken: p.quoteToken.serialize }))

export default farms
