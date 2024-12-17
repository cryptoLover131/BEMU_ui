import { useCallback } from 'react'
import { multiSendEther } from 'utils/calls/multisend'
import { useMultisender } from 'hooks/useContracts'

const useSendEther = () => {
  const senderContract = useMultisender()

  const handleSendEther = useCallback(
    async (totalAmount: number, addresses: string[], amounts: string[], tag: string) => {
      return multiSendEther(senderContract, totalAmount, addresses, amounts, tag)
    },
    [senderContract],
  )

  return { onSendEther: handleSendEther }
}

export default useSendEther
