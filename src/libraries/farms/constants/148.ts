import { shimmerTokens } from 'libraries/tokens'
import { SerializedFarmConfig } from '..'

const farms: SerializedFarmConfig[] = [
  {
    pid: 0,
    lpSymbol: 'CGT',
    lpAddress: '0x412eCCD21ea0A3C3c4b2fF6e87ae37647a8102Cd',
    quoteToken: shimmerTokens.usdt,
    token: shimmerTokens.gtoken,
    isTokenOnly: true
  },
  {
    pid: 1,
    lpSymbol: 'SMR-CGT LP',
    lpAddress: '0x83bf65b04df6dfc1200d9878a23e27822e2945ca',
    quoteToken: shimmerTokens.smr,
    token: shimmerTokens.gtoken,
  },
  {
    pid: 2,
    lpSymbol: 'CGT-USDT LP',
    lpAddress: '0x0fcc9cf18d95baed02ac827a97eba737884a1329',
    quoteToken: shimmerTokens.usdt,
    token: shimmerTokens.gtoken,
  },
  {
    pid: 3,
    lpSymbol: 'SMR-USDT LP',
    lpAddress: '0x4fc33da508423be75becb7dc735811169d748bb6',
    quoteToken: shimmerTokens.usdt,
    token: shimmerTokens.smr,
  },
  {
    pid: 4,
    lpSymbol: 'SMR-ETH LP',
    lpAddress: '0xca0d2dca83530c154350193830e7f44d5ab2098e',
    quoteToken: shimmerTokens.eth,
    token: shimmerTokens.smr,
  },
  {
    pid: 5,
    lpSymbol: 'SMR-WBTC LP',
    lpAddress: '0x81d91016d640be64d5ce5048488767304d505893',
    quoteToken: shimmerTokens.wbtc,
    token: shimmerTokens.smr,
  },
  {
    pid: 6,
    lpSymbol: 'SMR-BNB LP',
    lpAddress: '0xb2e551ab52b0735722df78e8bf2a1188e8f81ba2',
    quoteToken: shimmerTokens.bnb,
    token: shimmerTokens.smr,
  },
  {
    pid: 7,
    lpSymbol: 'SMR-USDC LP',
    lpAddress: '0x6a23dafe93b27d0fd91c858df2a878bd2b8f2d6a',
    quoteToken: shimmerTokens.usdc,
    token: shimmerTokens.smr,
  },
  {
    pid: 8,
    lpSymbol: 'SMR-MATIC LP',
    lpAddress: '0x2bf1298b55258776c08eb1ca233df10a7e1dc89b',
    quoteToken: shimmerTokens.matic,
    token: shimmerTokens.smr,
  },
].map((p) => ({ ...p, lpAddress: p.lpAddress as `0x${string}`, token: p.token.serialize, quoteToken: p.quoteToken.serialize }))

export default farms
