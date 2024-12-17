import BigNumber from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'
import { SerializedFarm, DeserializedFarmUserData } from './types'

export const deserializeFarmUserData = (farm: SerializedFarm | undefined): DeserializedFarmUserData => {
  return {
    allowance: farm?.userData ? new BigNumber(farm.userData.allowance) : BIG_ZERO,
    tokenBalance: farm?.userData ? new BigNumber(farm.userData.tokenBalance) : BIG_ZERO,
    stakedBalance: farm?.userData ? new BigNumber(farm.userData.stakedBalance) : BIG_ZERO,
    earnings: farm?.userData ? new BigNumber(farm.userData.earnings) : BIG_ZERO,
  }
}
