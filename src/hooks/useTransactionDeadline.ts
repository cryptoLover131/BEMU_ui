import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { useMemo } from 'react'

import { DEFAULT_DEADLINE_FROM_NOW } from 'config/constants'

import useCurrentBlockTimestamp from './useCurrentBlockTimestamp'

// deadline set by user in minutes, used in all txns
const userTxTTLAtom = atomWithStorage<number | undefined>('pcs:user:tx-ttl', undefined)

export function useUserTransactionTTL() {
  const [userTTL, setTTL] = useAtom(userTxTTLAtom)
  const ttl = useMemo(
    () =>
      userTTL === undefined
        ? DEFAULT_DEADLINE_FROM_NOW
        : userTTL,
    [userTTL],
  )
  return [ttl, setTTL] as const
}

// combines the block timestamp with the user setting to give the deadline that should be used for any submitted transaction
export function useTransactionDeadline() {
  const [ttl, setTTL] = useUserTransactionTTL()
  const blockTimestamp = useCurrentBlockTimestamp()
  const deadline = useMemo(() => {
    if (blockTimestamp && ttl) return blockTimestamp + BigInt(ttl)
    return undefined
  }, [blockTimestamp, ttl])

  return [deadline, setTTL] as const
}
