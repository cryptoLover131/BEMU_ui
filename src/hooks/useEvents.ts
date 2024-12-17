import { useMemo } from 'react'
import { Abi, Address } from 'viem'

import { useQuery } from '@tanstack/react-query'
import { FAST_INTERVAL } from 'config/constants'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { publicClient } from 'utils/wagmi'

function useEvents(
  address: Address,
  abi: Abi,
  eventName?: string,
  args?: any,
  fromBlock?: bigint,
  toBlock?: bigint
): {
  logs: any,
  isLoading: boolean
} {
  const { chainId } = useActiveChainId()

  const { data, isLoading } = useQuery({
    queryKey: [chainId, address, abi, eventName, args, fromBlock?.toString(), toBlock?.toString()],

    queryFn: () => {
      if (!address || !abi) {
        throw new Error('No address or abi')
      }
      return publicClient({ chainId }).getContractEvents({
        abi,
        address,
        eventName,
        // args,
        fromBlock,
        toBlock
      })
    },

    refetchInterval: FAST_INTERVAL,
    retry: true,
    refetchOnWindowFocus: false,
    enabled: Boolean(address && abi),
  })

  return useMemo(
    () => ({
      logs:
        address && abi && typeof data !== 'undefined'
          ? data
          : undefined,
      isLoading
    }),
    [address, abi, data, isLoading],
  )
}

export default useEvents
