import BigNumber from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'
import { getBalanceAmount } from 'utils/formatBalance'
import { createSelector } from '@reduxjs/toolkit'
import { DeserializedFarm, DeserializedFarmsState, deserializeFarm, deserializeFarmUserData } from 'libraries/farms'
import { State } from '../types'

const selectCakeFarm = (state: State) => state.farms.data.find((f) => f.pid === 2)
const selectFarmByKey = (key: string, value: string | number) => (state: State) =>
  state.farms.data.find((f) => f[key] === value)

export const makeFarmFromPidSelector = (pid: number) =>
createSelector([selectFarmByKey('pid', pid)], (farm) => farm && deserializeFarm(farm))

export const makeBusdPriceFromPidSelector = (pid: number) =>
  createSelector([selectFarmByKey('pid', pid)], (farm) => {
    return farm && new BigNumber(farm.tokenPriceBusd || '0')
  })

export const makeUserFarmFromPidSelector = (pid: number) =>
  createSelector([selectFarmByKey('pid', pid)], (farm) => {
    const { allowance, tokenBalance, stakedBalance, earnings } = deserializeFarmUserData(farm)
    return {
      allowance,
      tokenBalance,
      stakedBalance,
      earnings
    }
  })

export const priceCakeFromPidSelector = createSelector([selectCakeFarm], (cakeBnbFarm) => {
  const cakePriceBusdAsString = cakeBnbFarm?.tokenPriceBusd
  return new BigNumber(cakePriceBusdAsString || '0')
})

export const farmFromLpSymbolSelector = (lpSymbol: string) =>
  createSelector([selectFarmByKey('lpSymbol', lpSymbol)], (farm) => farm && deserializeFarm(farm))

export const makeLpTokenPriceFromLpSymbolSelector = (lpSymbol: string, isTokenOnly?: boolean) =>
  createSelector([selectFarmByKey('lpSymbol', lpSymbol)], (farm) => {
    let lpTokenPrice = BIG_ZERO
    if (farm) {
      const lpTotalInQuoteToken = farm.lpTotalInQuoteToken ? new BigNumber(farm.lpTotalInQuoteToken) : BIG_ZERO
      const lpTotalSupply = farm.lpTotalSupply ? new BigNumber(farm.lpTotalSupply) : BIG_ZERO
      if (lpTotalSupply.gt(0) && lpTotalInQuoteToken.gt(0)) {
        const farmTokenPriceInUsd = new BigNumber(farm.tokenPriceBusd || '0')
        const tokenAmountTotal = farm.tokenAmountTotal ? new BigNumber(farm.tokenAmountTotal) : BIG_ZERO
        // Total value of base token in LP
        const valueOfBaseTokenInFarm = farmTokenPriceInUsd.times(tokenAmountTotal)
        // Double it to get overall value in LP
        const overallValueOfAllTokensInFarm = valueOfBaseTokenInFarm.times(2)
        // Divide total value of all tokens, by the number of LP tokens
        const totalLpTokens = getBalanceAmount(lpTotalSupply)
        lpTokenPrice = isTokenOnly ? new BigNumber(farm.tokenPriceBusd || '0') : overallValueOfAllTokensInFarm.div(totalLpTokens)
      }
    }

    return lpTokenPrice
  }
)

function mapFarm(farms, chainId): DeserializedFarmsState {
  const deserializedFarmsData = farms.data
    .map(deserializeFarm)
    .filter((farm) => farm.token.chainId === chainId) as DeserializedFarm[]
  const { loadArchivedFarmsData, userDataLoaded, poolLength, regularCakePerBlock, totalAllocPoint } = farms

  return {
    data: deserializedFarmsData,
    loadArchivedFarmsData: Boolean(loadArchivedFarmsData),
    userDataLoaded: Boolean(userDataLoaded),
    poolLength: poolLength as number,
    regularCakePerBlock: regularCakePerBlock as number,
    totalAllocPoint: totalAllocPoint as string,
  }
}

const selectFarms = (state: State) => state.farms

export const farmSelector = (chainId?: number) => createSelector([selectFarms], (farms) => mapFarm(farms, chainId))
