import { useCallback } from 'react'
import { MaxUint256 } from 'libraries/swap-sdk-core'
import { useERC20 } from 'hooks/useContracts'
import { getMasterChefAddress } from 'utils/addressHelpers'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'

const useApproveFarm = (lpContract: ReturnType<typeof useERC20>, chainId: number) => {
  const contractAddress = getMasterChefAddress(chainId)

  const { callWithGasPrice } = useCallWithGasPrice()
  const handleApprove = useCallback(async (amount: bigint) => {
    return callWithGasPrice(lpContract, 'approve', [contractAddress, amount])
  }, [lpContract, contractAddress, callWithGasPrice])

  return { onApprove: handleApprove }
}

export default useApproveFarm

export const useApproveBoostProxyFarm = (lpContract: ReturnType<typeof useERC20>, proxyAddress?: `0x${string}`) => {
  const { callWithGasPrice } = useCallWithGasPrice()
  const handleApprove = useCallback(async () => {
    return proxyAddress && callWithGasPrice(lpContract, 'approve', [proxyAddress, MaxUint256])
  }, [lpContract, proxyAddress, callWithGasPrice])

  return { onApprove: handleApprove }
}
