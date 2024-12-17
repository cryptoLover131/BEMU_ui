import { polygonTokens } from 'libraries/tokens'
import { SerializedFarmConfig } from '..'

const farms: SerializedFarmConfig[] = [
  {
    pid: 0,
    lpSymbol: 'DKO',
    lpAddress: '0x1F8AA9047Ecb2284e04FBC82803e1448f64DE27a',
    quoteToken: polygonTokens.wmatic,
    token: polygonTokens.gtoken,
    isTokenOnly: true,
  },
  {
    pid: 1,
    lpSymbol: 'DKO-MATIC LP',
    lpAddress: '0x0E66F5EC1249f94F205Ab4CfEb226DA2d568b1Ff',
    quoteToken: polygonTokens.wmatic,
    token: polygonTokens.gtoken,
  },
  {
    pid: 2,
    lpSymbol: 'DKO-USDT LP',
    lpAddress: '0x7c6D4c120F9aBE57C3ea0C7cDBF9280CB937456b',
    quoteToken: polygonTokens.usdt,
    token: polygonTokens.gtoken,
  },
  {
    pid: 3,
    lpSymbol: 'DKO-USDC LP',
    lpAddress: '0xe924882796a7F66E1DeE79078494c2955Df39D45',
    quoteToken: polygonTokens.usdc,
    token: polygonTokens.gtoken,
  },
  {
    pid: 4,
    lpSymbol: 'DKO-DAI LP',
    lpAddress: '0x4BD111b7197AdEcb36E89B473D3159dE462C26a6',
    quoteToken: polygonTokens.dai,
    token: polygonTokens.gtoken,
  },
  {
    pid: 5,
    lpSymbol: 'MATIC-USDT LP',
    lpAddress: '0x6D65adF782C202788b1814E39cad2221547C1900',
    quoteToken: polygonTokens.wmatic,
    token: polygonTokens.usdt,
  },
  {
    pid: 6,
    lpSymbol: 'MATIC-USDC LP',
    lpAddress: '0xD80A78f512829458b25A503737cf78d2e0Dc301B',
    quoteToken: polygonTokens.wmatic,
    token: polygonTokens.usdc,
  },
  {
    pid: 7,
    lpSymbol: 'USDT-USDC LP',
    lpAddress: '0xFc345B2Ea902A96A0638a3AfB5864FA61054D6cC',
    quoteToken: polygonTokens.usdt,
    token: polygonTokens.usdc,
  },
  {
    pid: 8,
    lpSymbol: 'USDC-DAI LP',
    lpAddress: '0x57B4bE69034273ce6c2E1252CB070110315FD408',
    quoteToken: polygonTokens.usdc,
    token: polygonTokens.dai,
  },
  {
    pid: 9,
    lpSymbol: 'WBTC-USDT LP',
    lpAddress: '0x51529Fb7d4624F36F222f29656C52e3192CA80eE',
    quoteToken: polygonTokens.usdt,
    token: polygonTokens.wbtc,
  },
  {
    pid: 10,
    lpSymbol: 'WBTC-DAI LP',
    lpAddress: '0x97442C8Ab7B867599F0Db2ECAfa631b127bd3901',
    quoteToken: polygonTokens.wbtc,
    token: polygonTokens.dai,
  },
  {
    pid: 11,
    lpSymbol: 'MATIC-WETH LP',
    lpAddress: '0x4aCF5B2b270aa80460413C808F6f1F0B7d881dBa',
    quoteToken: polygonTokens.wmatic,
    token: polygonTokens.weth,
  },
  {
    pid: 12,
    lpSymbol: 'USDC-WETH LP',
    lpAddress: '0xF921863DC132122873fc78109cC6D491b6bE30ef',
    quoteToken: polygonTokens.usdc,
    token: polygonTokens.weth,
  },
  {
    pid: 13,
    lpSymbol: 'USDT-WETH LP',
    lpAddress: '0xC2bbd56962933a6150C954Ce7655F36EC77be164',
    quoteToken: polygonTokens.usdt,
    token: polygonTokens.weth,
  },
].map((p) => ({ ...p, lpAddress: p.lpAddress as `0x${string}`, token: p.token.serialize, quoteToken: p.quoteToken.serialize }))

export default farms
