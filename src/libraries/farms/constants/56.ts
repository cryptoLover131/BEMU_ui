import { bscTokens } from 'libraries/tokens'
import { SerializedFarmConfig } from '..'

const farms: SerializedFarmConfig[] = [
  {
    pid: 0,
    lpSymbol: 'DKO',
    lpAddress: '0x1F8AA9047Ecb2284e04FBC82803e1448f64DE27a',
    quoteToken: bscTokens.wbnb,
    token: bscTokens.gtoken,
    isTokenOnly: true,
  },
  {
    pid: 1,
    lpSymbol: 'DKO-BNB LP',
    lpAddress: '0x80bD4f52f36b5772b89A2EC0b80c5080cFf4BaC9',
    quoteToken: bscTokens.wbnb,
    token: bscTokens.gtoken,
  },
  {
    pid: 2,
    lpSymbol: 'DKO-USDT LP',
    lpAddress: '0xf31f31b198e19E12baF3Aa2A9e0F05E837dDDBC0',
    quoteToken: bscTokens.usdt,
    token: bscTokens.gtoken,
  },
  {
    pid: 3,
    lpSymbol: 'DKO-USDC LP',
    lpAddress: '0xd598Cd93103D205ceAaEa3b05733FA0e19EE8E76',
    quoteToken: bscTokens.usdc,
    token: bscTokens.gtoken,
  },
  {
    pid: 4,
    lpSymbol: 'DKO-DAI LP',
    lpAddress: '0x5b644fa75dFC91f453190c4eBCD85AfE365f8202',
    quoteToken: bscTokens.dai,
    token: bscTokens.gtoken,
  },
  {
    pid: 5,
    lpSymbol: 'BNB-USDT LP',
    lpAddress: '0x8E3084D1F7246BD63f8df09eCa075B738C757696',
    quoteToken: bscTokens.bnb,
    token: bscTokens.usdt,
  },
  {
    pid: 6,
    lpSymbol: 'BNB-USDC LP',
    lpAddress: '0xf1F27432eE9f9D1c366C45Ff06dEa2C38586F825',
    quoteToken: bscTokens.bnb,
    token: bscTokens.usdc,
  },
  {
    pid: 7,
    lpSymbol: 'USDT-USDC LP',
    lpAddress: '0x06Da11093bc03D54d214391e32A1A61A527A71C3',
    quoteToken: bscTokens.usdt,
    token: bscTokens.usdc,
  },
  {
    pid: 8,
    lpSymbol: 'USDC-DAI LP',
    lpAddress: '0x3dc0814D9DB34Dd6223c727000a05ea0e8cB0d34',
    quoteToken: bscTokens.usdc,
    token: bscTokens.dai,
  },
  {
    pid: 9,
    lpSymbol: 'BTCB-USDT LP',
    lpAddress: '0x89276b05e5702904915BCbc6A0e217fd28F94694',
    quoteToken: bscTokens.usdt,
    token: bscTokens.btcb,
  },
  {
    pid: 10,
    lpSymbol: 'BTCB-DAI LP',
    lpAddress: '0x8Cba424799789F7E1c0090445fDDB0c1399aF00b',
    quoteToken: bscTokens.btcb,
    token: bscTokens.dai,
  },
  {
    pid: 11,
    lpSymbol: 'BNB-ETH LP',
    lpAddress: '0x4889dbeB2467Cd4f343B5Cf0FB9448dD090a0198',
    quoteToken: bscTokens.wbnb,
    token: bscTokens.eth,
  },
  {
    pid: 12,
    lpSymbol: 'USDC-ETH LP',
    lpAddress: '0x19751f7F4d1b697f09f6306e0CB3924E42E9c545',
    quoteToken: bscTokens.usdc,
    token: bscTokens.eth,
  },
  {
    pid: 13,
    lpSymbol: 'USDT-ETH LP',
    lpAddress: '0xB1551C126e7499da5ECEf63593C25dC28Cd63Bc8',
    quoteToken: bscTokens.usdt,
    token: bscTokens.eth,
  },
].map((p) => ({ ...p, lpAddress: p.lpAddress as `0x${string}`, token: p.token.serialize, quoteToken: p.quoteToken.serialize }))

export default farms
