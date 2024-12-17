import { ChainId } from 'config/chains'
import { ERC20Token } from 'libraries/swap-sdk'

export const GTOKEN_BSC = new ERC20Token(
  ChainId.BSC,
  '0x1F8AA9047Ecb2284e04FBC82803e1448f64DE27a',
  18,
  'DKO',
  'Duckstail Token',
  'https://duckstail.com/',
)

export const GTOKEN_BASE = new ERC20Token(
  ChainId.BASE,
  '0x9DF99136da5bc4dDf50AfE9617AfE93BB20D997B',
  18,
  'BEMU',
  'BEMU',
  '',
)

export const GTOKEN_ETH = new ERC20Token(
  ChainId.ETHEREUM,
  '0x4793405c2231D8646F8ee79E120c230c574b0c4B',
  18,
  'NOI',
  'NOI Token',
  'https://noiexchange.net/',
)

export const GTOKEN_POLYGON = new ERC20Token(
  ChainId.POLYGON,
  '0x1F8AA9047Ecb2284e04FBC82803e1448f64DE27a',
  18,
  'DKO',
  'Duckstail Token',
  'https://duckstail.com/',
)
export const GTOKEN_ARB = new ERC20Token(
  ChainId.ARBITRUM,
  '0xcBC8e435993af38950a708Be002e1A6d1280132B',
  18,
  'DKO',
  'Duckstail Token',
  'https://duckstail.com/',
)

export const GTOKEN_SMR = new ERC20Token(
  ChainId.SHIMMER,
  '0x412eCCD21ea0A3C3c4b2fF6e87ae37647a8102Cd',
  18,
  'CGT',
  'CyberGlow Token',
  'https://cyberglow.finance/',
)

export const USDC_BSC = new ERC20Token(
  ChainId.BSC,
  '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
  18,
  'USDC',
  'Binance-Peg USD Coin',
  'https://www.centre.io/usdc',
)

export const USDC_ETH = new ERC20Token(
  ChainId.ETHEREUM,
  '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  6,
  'USDC',
  'USD Coin',
)

export const USDC_POLYGON = new ERC20Token(
  ChainId.POLYGON,
  '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
  6,
  'USDC',
  'USD Coin',
)

export const USDC_ARB = new ERC20Token(
  ChainId.ARBITRUM,
  '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
  6,
  'USDC',
  'USD Coin',
)

export const USDC_SMR = new ERC20Token(
  ChainId.SHIMMER,
  '0xeCE555d37C37D55a6341b80cF35ef3BC57401d1A',
  6,
  'USDC',
  'USD Coin',
)

export const USDC_BASE = new ERC20Token(
  ChainId.BASE,
  '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  6,
  'USDC',
  'USDCoin',
  '',
)

export const USDT_BSC = new ERC20Token(
  ChainId.BSC,
  '0x55d398326f99059fF775485246999027B3197955',
  18,
  'USDT',
  'Tether USD',
  'https://tether.to/',
)

export const USDT_ETH = new ERC20Token(
  ChainId.ETHEREUM,
  '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  6,
  'USDT',
  'Tether USD',
  'https://tether.to/',
)

export const USDT_POLYGON = new ERC20Token(
  ChainId.POLYGON,
  '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
  6,
  'USDT',
  'Tether USD',
  'https://tether.to/',
)

export const USDT_ARB = new ERC20Token(
  ChainId.ARBITRUM,
  '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
  6,
  'USDT',
  'Tether USD',
  'https://tether.to/',
)

export const USDT_SMR = new ERC20Token(
  ChainId.SHIMMER,
  '0xa4f8C7C1018b9dD3be5835bF00f335D9910aF6Bd',
  6,
  'USDT',
  'Tether USD',
  'https://tether.to/',
)

export const BUSD_BSC = new ERC20Token(
  ChainId.BSC,
  '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
  18,
  'BUSD',
  'Binance USD',
  'https://www.paxos.com/busd/',
)

export const BUSD_ETH = new ERC20Token(
  ChainId.ETHEREUM,
  '0x4Fabb145d64652a948d72533023f6E7A623C7C53',
  18,
  'BUSD',
  'Binance USD',
  'https://www.paxos.com/busd/',
)

export const BUSD_POLYGON = new ERC20Token(
  ChainId.POLYGON,
  '0x4Fabb145d64652a948d72533023f6E7A623C7C53',
  18,
  'BUSD',
  'Binance USD',
  'https://www.paxos.com/busd/',
)

export const DAI_POLYGON = new ERC20Token(
  ChainId.POLYGON,
  '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
  18,
  'DAI',
  'Dai Stablecoin',
  'https://makerdao.com/',
)

export const DAI_ETH = new ERC20Token(
  ChainId.ETHEREUM,
  '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  18,
  'DAI',
  'Dai Stablecoin',
  'https://makerdao.com/',
)

export const DAI_ARB = new ERC20Token(
  ChainId.ARBITRUM,
  '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
  18,
  'DAI',
  'Dai Stablecoin',
  'https://makerdao.com/',
)

export const WBTC_ETH = new ERC20Token(
  ChainId.ETHEREUM,
  '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
  8,
  'WBTC',
  'Wrapped BTC',
)

export const WBTC_POLYGON = new ERC20Token(
  ChainId.POLYGON,
  '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6',
  8,
  'WBTC',
  'Wrapped BTC',
)

export const WBTC_ARB = new ERC20Token(
  ChainId.ARBITRUM,
  '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
  8,
  'WBTC',
  'Wrapped BTC',
)

export const WBTC_SMR = new ERC20Token(
  ChainId.SHIMMER,
  '0xb0119035d08CB5f467F9ed8Eae4E5f9626Aa7402',
  8,
  'WBTC',
  'Wrapped Bitcoin',
)

export const DCP_ARB = new ERC20Token(
  ChainId.ARBITRUM,
  '0xdd5D2Ba8b84AA4E145efC3D055fD0e75bcB9E28c',
  9,
  'DCP',
  'Duckstail Capital',
)

export const SDCP_ARB = new ERC20Token(
  ChainId.ARBITRUM,
  '0xbb93Cae0127d5D8e9501D997b96f780B6B5ce4e1',
  9,
  'SDCP',
  'Staked DCP',
)

export const GTOKEN = {
  [ChainId.ARBITRUM]: GTOKEN_ARB,
  [ChainId.POLYGON]: GTOKEN_POLYGON,
  [ChainId.BSC]: GTOKEN_BSC,
  [ChainId.ETHEREUM]: GTOKEN_ETH,
  [ChainId.SHIMMER]: GTOKEN_SMR,
  [ChainId.BASE]: GTOKEN_BASE,
}

export const USDC = {
  [ChainId.BSC]: USDC_BSC,
  [ChainId.ETHEREUM]: USDC_ETH,
  [ChainId.ARBITRUM]: USDC_ARB,
  [ChainId.POLYGON]: USDC_POLYGON,
  [ChainId.SHIMMER]: USDC_SMR,
  [ChainId.BASE]: USDC_BASE,
}

export const USDT = {
  [ChainId.ETHEREUM]: USDT_ETH,
  [ChainId.ARBITRUM]: USDT_ARB,
  [ChainId.BSC]: USDT_BSC,
  [ChainId.POLYGON]: USDT_POLYGON,
  [ChainId.SHIMMER]: USDT_SMR,
}

export const DAI = {
  [ChainId.ETHEREUM]: DAI_ETH,
  [ChainId.ARBITRUM]: DAI_ARB,
  [ChainId.POLYGON]: DAI_POLYGON,
}

export const BUSD = {
  [ChainId.ETHEREUM]: BUSD_ETH,
  [ChainId.BSC]: BUSD_BSC,
}

export const DCP = {
  [ChainId.ARBITRUM]: DCP_ARB,
}

export const SDCP = {
  [ChainId.ARBITRUM]: SDCP_ARB,
}

export const PCB_ARB = new ERC20Token(
  ChainId.ARBITRUM,
  '0x02caEFC9083AFCD630beFdB2e67EC73FC3b2B42B',
  18,
  'PCB',
  'PentaCoin',
)

export const PCB_BSC = new ERC20Token(
  ChainId.BSC,
  '0x02caEFC9083AFCD630beFdB2e67EC73FC3b2B42B',
  18,
  'PCB',
  'PentaCoin',
)

export const PCB_POLYGON = new ERC20Token(
  ChainId.POLYGON,
  '0x02caEFC9083AFCD630beFdB2e67EC73FC3b2B42B',
  18,
  'PCB',
  'PentaCoin',
)

export const PCB = {
  [ChainId.ARBITRUM]: PCB_ARB,
  [ChainId.BSC]: PCB_BSC,
  [ChainId.POLYGON]: PCB_POLYGON,
}
