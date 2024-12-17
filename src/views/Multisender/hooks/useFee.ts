import { useMemo } from 'react'
import { useSingleCallResult } from 'state/multicall/hooks'
import { useMultisender } from 'hooks/useContracts'

// returns undefined if input token is undefined, or fails to get token contract,
// or contract total supply cannot be fetched
function useFee(): string | undefined {
  const contract = useMultisender()

  const fee: string | undefined = useSingleCallResult({
    contract,
    functionName: 'feeRate',
  })?.result?.toString()

  return useMemo(
    () => fee,
    [fee],
  )
}

export default useFee
