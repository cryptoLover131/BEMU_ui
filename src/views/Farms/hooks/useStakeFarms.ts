import { useCallback } from 'react'
import { stakeFarm } from 'utils/calls/farms'
import { useMasterchef } from 'hooks/useContracts'

const useStakeFarms = (pid: number) => {
  const masterChefContract = useMasterchef()

  const handleStake = useCallback(
    async (amount: string) => {
      return stakeFarm(masterChefContract, pid, amount)
    },
    [masterChefContract, pid],
  )

  return { onStake: handleStake }
}

export default useStakeFarms
