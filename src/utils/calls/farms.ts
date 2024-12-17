import BigNumber from 'bignumber.js'
import { getMasterChefContract } from 'utils/contractHelpers'

type MasterchefContract = ReturnType<typeof getMasterChefContract>

export const stakeFarm = async (masterChefContract: MasterchefContract, pid, amount) => {
  const value = new BigNumber(amount).times(1e18).toString()
  if (pid !== 0) {
    return masterChefContract.write.deposit([pid, BigInt(value)], {
      account: masterChefContract.account ?? '0x',
      chain: masterChefContract.chain
    })
  }
  return masterChefContract.write.enterStaking([BigInt(value)], {
    account: masterChefContract.account ?? '0x',
    chain: masterChefContract.chain
  })
}

export const unstakeFarm = async (masterChefContract: MasterchefContract, pid, amount) => {
  const value = new BigNumber(amount).times(1e18).toString()

  if (pid !== 0) {
    return masterChefContract.write.withdraw([pid, BigInt(value)], {
      account: masterChefContract.account ?? '0x',
      chain: masterChefContract.chain
    })
  }
  return masterChefContract.write.leaveStaking([BigInt(value)], {
    account: masterChefContract.account ?? '0x',
    chain: masterChefContract.chain
  })
}

export const harvestFarm = async (masterChefContract: MasterchefContract, pid) => {
  if (pid !== 0) {
    return masterChefContract.write.deposit([pid, 0n], {
      account: masterChefContract.account ?? '0x',
      chain: masterChefContract.chain
    })
  }
  return masterChefContract.write.enterStaking([0n], {
    account: masterChefContract.account ?? '0x',
    chain: masterChefContract.chain
  })
}
