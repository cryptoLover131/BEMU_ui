import { getFarmConfig } from 'libraries/farms/constants'
import { SerializedFarm, SerializedFarmsState } from 'libraries/farms'
import { SUPPORTED_CHAINS } from 'config/constants/supportChains'
import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit'
import type {
  UnknownAsyncThunkFulfilledAction,
  UnknownAsyncThunkPendingAction,
  UnknownAsyncThunkRejectedAction,
} from '@reduxjs/toolkit/dist/matchers'
import BigNumber from 'bignumber.js'
import stringify from 'fast-json-stable-stringify'
import keyBy from 'lodash/keyBy'
import type { AppState } from 'state'
import { getBalanceAmount } from 'utils/formatBalance'
import { chains } from 'utils/wagmi'
import { resetUserState } from '../global/actions'
import fetchFarms from './fetchFarms'
import {
  fetchFarmUserAllowances,
  fetchFarmUserEarnings,
  fetchFarmUserStakedBalances,
  fetchFarmUserTokenBalances,
} from './fetchFarmUser'
import { fetchMasterChefFarmPoolLength, fetchMasterChefTokenPerTime } from './fetchMasterChefData'
import getFarmsPrices from './getFarmsPrices'

const fetchFarmPublicData = async ({ pids, chainId }): Promise<[SerializedFarm[], number, number]> => {
  const [poolLength, tokenPerTime] = await Promise.all([
    fetchMasterChefFarmPoolLength(chainId),
    fetchMasterChefTokenPerTime(chainId)
  ])

  const poolLengthAsBigNumber = new BigNumber(poolLength.toString())
  const regularTokenPerTime = getBalanceAmount(new BigNumber(tokenPerTime.toString()))
  const farmsConfig = await getFarmConfig(chainId)
  const farmsCanFetch = farmsConfig.filter(
    (farmConfig) => pids.includes(farmConfig.pid) && poolLengthAsBigNumber.gt(farmConfig.pid),
  )
  // const priceHelperLpsConfig = getFarmsPriceHelperLpFiles(chainId)
  const farms = await fetchFarms(farmsCanFetch, chainId)
  const farmsWithPrices = farms.length > 0 ? getFarmsPrices(farms, chainId) : []
  return [farmsWithPrices, poolLengthAsBigNumber.toNumber(), regularTokenPerTime.toNumber()]
}

const initialState: SerializedFarmsState = {
  data: [],
  chainId: undefined,
  loadArchivedFarmsData: false,
  userDataLoaded: false,
  loadingKeys: {},
}

// Async thunks
export const fetchInitialFarmsData = createAsyncThunk<
  { data: SerializedFarm[]; chainId: number },
  { chainId: number },
  {
    state: AppState
  }
>('farms/fetchInitialFarmsData', async ({ chainId }) => {
  const farmDataList = await getFarmConfig(chainId)
  return {
    data: farmDataList.map((farm) => ({
      ...farm,
      userData: {
        allowance: '0',
        tokenBalance: '0',
        stakedBalance: '0',
        earnings: '0',
      },
    })),
    chainId,
  }
})

export const fetchFarmsPublicDataAsync = createAsyncThunk<
  [SerializedFarm[], number, number],
  { pids: number[]; chainId: number },
  {
    state: AppState
  }
>(
  'farms/fetchFarmsPublicDataAsync',
  async ({ pids, chainId }, { dispatch, getState }) => {
    const state = getState()
    if (state.farms.chainId !== chainId) {
      await dispatch(fetchInitialFarmsData({ chainId }))
    }
    const chain = chains.find((c) => c.id === chainId)
    if (!chain || !SUPPORTED_CHAINS.includes(chain.id)) throw new Error('chain not supported')
    try {
      return fetchFarmPublicData({ pids, chainId })
    } catch (error) {
      console.error(error)
      throw error
    }
  },
  {
    condition: (arg, { getState }) => {
      const { farms } = getState()
      if (farms.loadingKeys[stringify({ type: fetchFarmsPublicDataAsync.typePrefix, arg })]) {
        console.debug('farms action is fetching, skipping here')
        return false
      }
      return true
    },
  },
)

interface FarmUserDataResponse {
  pid: number
  allowance: string
  tokenBalance: string
  stakedBalance: string
  earnings: string
  proxy?: {
    allowance: string
    tokenBalance: string
    stakedBalance: string
    earnings: string
  }
}

async function getNormalFarmsStakeValue(farms, account, chainId) {
  const [userFarmAllowances, userFarmTokenBalances, userStakedBalances, userFarmEarnings] = await Promise.all([
    fetchFarmUserAllowances(account, farms, chainId),
    fetchFarmUserTokenBalances(account, farms, chainId),
    fetchFarmUserStakedBalances(account, farms, chainId),
    fetchFarmUserEarnings(account, farms, chainId),
  ])

  const normalFarmAllowances = userFarmAllowances.map((_, index) => {
    return {
      pid: farms[index].pid,
      allowance: userFarmAllowances[index],
      tokenBalance: userFarmTokenBalances[index],
      stakedBalance: userStakedBalances[index],
      earnings: userFarmEarnings[index],
    }
  })

  return normalFarmAllowances
}

export const fetchFarmUserDataAsync = createAsyncThunk<
  FarmUserDataResponse[],
  { account: `0x${string}`; pids: number[]; chainId: number },
  {
    state: AppState
  }
>(
  'farms/fetchFarmUserDataAsync',
  async ({ account, pids, chainId }, { dispatch, getState }) => {
    const state = getState()
    if (state.farms.chainId !== chainId) {
      await dispatch(fetchInitialFarmsData({ chainId }))
    }
    // const poolLength = state.farms.poolLength ?? (await fetchMasterChefFarmPoolLength(ChainId.BSC))
    const poolLength = state.farms.poolLength ?? (await fetchMasterChefFarmPoolLength(chainId))
    const farmsConfig = await getFarmConfig(chainId)
    const farmsCanFetch = farmsConfig.filter(
      (farmConfig) => pids.includes(farmConfig.pid) && poolLength > farmConfig.pid,
    )

    return getNormalFarmsStakeValue(farmsCanFetch, account, chainId)
  },
  {
    condition: (arg, { getState }) => {
      const { farms } = getState()
      if (farms.loadingKeys[stringify({ type: fetchFarmUserDataAsync.typePrefix, arg })]) {
        console.debug('farms user action is fetching, skipping here')
        return false
      }
      return true
    },
  },
)

type UnknownAsyncThunkFulfilledOrPendingAction =
  | UnknownAsyncThunkFulfilledAction
  | UnknownAsyncThunkPendingAction
  | UnknownAsyncThunkRejectedAction

const serializeLoadingKey = (
  action: UnknownAsyncThunkFulfilledOrPendingAction,
  suffix: UnknownAsyncThunkFulfilledOrPendingAction['meta']['requestStatus'],
) => {
  const type = action.type.split(`/${suffix}`)[0]
  return stringify({
    arg: action.meta.arg,
    type,
  })
}

export const farmsSlice = createSlice({
  name: 'Farms',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(resetUserState, (state) => {
      state.data = state.data.map((farm) => {
        return {
          ...farm,
          userData: {
            allowance: '0',
            tokenBalance: '0',
            stakedBalance: '0',
            earnings: '0',
          },
        }
      })
      state.userDataLoaded = false
    })
    // Init farm data
    builder.addCase(fetchInitialFarmsData.fulfilled, (state, action) => {
      const { data, chainId } = action.payload
      state.data = data
      state.chainId = chainId
    })

    // Update farms with live data
    builder.addCase(fetchFarmsPublicDataAsync.fulfilled, (state, action) => {
      const [farmPayload, poolLength, regularCakePerBlock] = action.payload
      const farmPayloadPidMap = keyBy(farmPayload, 'pid')

      state.data = state.data.map((farm) => {
        const liveFarmData = farmPayloadPidMap[farm.pid]
        return { ...farm, ...liveFarmData }
      })
      state.poolLength = poolLength
      state.regularCakePerBlock = regularCakePerBlock
    })

    // Update farms with user data
    builder.addCase(fetchFarmUserDataAsync.fulfilled, (state, action) => {
      const userDataMap = keyBy(action.payload, 'pid')
      state.data = state.data.map((farm) => {
        const userDataEl = userDataMap[farm.pid]
        if (userDataEl) {
          return { ...farm, userData: userDataEl }
        }
        return farm
      })
      state.userDataLoaded = true
    })

    builder.addMatcher(isAnyOf(fetchFarmUserDataAsync.pending, fetchFarmsPublicDataAsync.pending), (state, action) => {
      state.loadingKeys[serializeLoadingKey(action, 'pending')] = true
    })
    builder.addMatcher(
      isAnyOf(fetchFarmUserDataAsync.fulfilled, fetchFarmsPublicDataAsync.fulfilled),
      (state, action) => {
        state.loadingKeys[serializeLoadingKey(action, 'fulfilled')] = false
      },
    )
    builder.addMatcher(
      isAnyOf(fetchFarmsPublicDataAsync.rejected, fetchFarmUserDataAsync.rejected),
      (state, action) => {
        state.loadingKeys[serializeLoadingKey(action, 'rejected')] = false
      },
    )
  },
})

export default farmsSlice.reducer
