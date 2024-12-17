import { SerializedWrappedToken } from 'libraries/token-lists'
import BigNumber from 'bignumber.js'
import { Token } from 'libraries/swap-sdk-core'

export type FarmsDynamicDataResult = {
  tokenAmountTotal: string
  quoteTokenAmountTotal: string
  lpTotalSupply: string
  lpTotalInQuoteToken: string
  tokenPriceVsQuote: string
  poolWeight: string
  multiplier: string
}
export type FarmData = SerializedFarmConfig & FarmsDynamicDataResult

export interface FarmConfigBaseProps {
  pid: number
  lpSymbol: string
  lpAddress: `0x${string}`
  multiplier?: string
  isTokenOnly?: boolean
}

export interface SerializedFarmConfig extends FarmConfigBaseProps {
  token: SerializedWrappedToken
  quoteToken: SerializedWrappedToken
}

export interface SerializedFarmPublicData extends SerializedFarmConfig {
  apr?: string
  lpTokenPrice?: string
  tokenPriceBusd?: string
  quoteTokenPriceBusd?: string
  tokenAmountTotal?: string
  quoteTokenAmountTotal?: string
  lpTotalInQuoteToken?: string
  lpTotalSupply?: string
  tokenPriceVsQuote?: string
  poolWeight?: string
  lpTokenStakedAmount?: string
}

export interface AprMap {
  [key: string]: number
}

export interface SerializedFarmUserData {
  allowance: string
  tokenBalance: string
  stakedBalance: string
  earnings: string
}

export interface SerializedFarm extends SerializedFarmPublicData {
  userData?: SerializedFarmUserData
}

export interface SerializedFarmsState {
  data: SerializedFarm[]
  chainId?: number
  loadArchivedFarmsData: boolean
  userDataLoaded: boolean
  loadingKeys: Record<string, boolean>
  poolLength?: number
  regularCakePerBlock?: number
  totalAllocPoint?: number
}

export interface DeserializedFarmConfig extends FarmConfigBaseProps {
  token: Token
  quoteToken: Token
}

export interface DeserializedFarmUserData {
  allowance: BigNumber
  tokenBalance: BigNumber
  stakedBalance: BigNumber
  earnings: BigNumber
}

export interface DeserializedFarm extends DeserializedFarmConfig {
  tokenPriceBusd?: string
  quoteTokenPriceBusd?: string
  tokenAmountTotal?: BigNumber
  quoteTokenAmountTotal?: BigNumber
  lpTotalInQuoteToken?: BigNumber
  lpTotalSupply?: BigNumber
  lpTokenPrice?: BigNumber
  tokenPriceVsQuote?: BigNumber
  poolWeight?: BigNumber
  userData?: DeserializedFarmUserData
  lpTokenStakedAmount?: BigNumber
}

export interface DeserializedFarmsState {
  data: DeserializedFarm[]
  loadArchivedFarmsData: boolean
  userDataLoaded: boolean
  poolLength?: number
  regularCakePerBlock?: number
  totalAllocPoint?: string
}

export interface FarmWithStakedValue extends DeserializedFarm {
  apr?: number | null
  lpRewardsApr?: number
  liquidity?: BigNumber
}
