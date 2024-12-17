import { useCallback } from 'react'
import { unstakeFarm } from 'utils/calls/farms'
import { useMasterchef } from 'hooks/useContracts'

const useUnstakeFarms = (pid: number) => {
  const masterChefContract = useMasterchef()

  const handleUnstake = useCallback(
    async (amount: string) => {
      return unstakeFarm(masterChefContract, pid, amount)
    },
    [masterChefContract, pid],
  )
  return { onUnstake: handleUnstake }
}

export default useUnstakeFarms
