import { useCallback } from 'react'
import { harvestFarm } from 'utils/calls/farms'
import { useMasterchef } from 'hooks/useContracts'

const useHarvestFarm = (farmPid: number) => {
  const masterChefContract = useMasterchef()

  const handleHarvest = useCallback(async () => {
    return harvestFarm(masterChefContract, farmPid)
  }, [farmPid, masterChefContract])

  return { onReward: handleHarvest }
}

export default useHarvestFarm
