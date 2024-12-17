import { useCallback } from 'react'
import { multiSendToken } from 'utils/calls/multisend'
import { useMultisender } from 'hooks/useContracts'

const useSendToken = () => {
  const senderContract = useMultisender()

  const handleSendToken = useCallback(
    async (token: string, addresses: string[], amounts: string[], tag: string) => {
      return multiSendToken(senderContract, token, addresses, amounts, tag)
    },
    [senderContract],
  )

  return { onSendToken: handleSendToken }
}

export default useSendToken
