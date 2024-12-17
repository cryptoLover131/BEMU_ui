import { CHAIN_QUERY_NAME } from 'config/chains'
import { useToast } from 'contexts'
import replaceBrowserHistory from 'utils/replaceBrowserHistory'
import { useCallback, useMemo } from 'react'
import { useAccount, useSwitchChain } from 'wagmi'
import { useSessionChainId } from './useSessionChainId'
import { useSwitchNetworkLoading } from './useSwitchNetworkLoading'

export function useSwitchNetworkLocal() {
  const [, setSessionChainId] = useSessionChainId()

  return useCallback(
    (chainId: number) => {
      replaceBrowserHistory('chain', CHAIN_QUERY_NAME[chainId])
      setSessionChainId(chainId)
    },
    [setSessionChainId],
  )
}

export function useSwitchNetwork() {
  const [loading, setLoading] = useSwitchNetworkLoading()
  const {
    status,
    switchChainAsync: _switchNetworkAsync,
    switchChain: _switchNetwork,
    ...switchNetworkArgs
  } = useSwitchChain()

  const _isLoading = status === 'pending'

  const { toastError } = useToast()
  const { isConnected } = useAccount()

  const switchNetworkLocal = useSwitchNetworkLocal()

  const isLoading = _isLoading || loading

  const switchNetworkAsync = useCallback(
    async (chainId: number) => {
      if (isConnected && typeof _switchNetworkAsync === 'function') {
        if (isLoading) return undefined
        setLoading(true)
        return _switchNetworkAsync({ chainId })
          .then((c) => {
            switchNetworkLocal(chainId)
            return c
          })
          .catch(() => {
            // TODO: review the error
            toastError('Error connecting, please retry and confirm in wallet!')
          })
          .finally(() => setLoading(false))
      }
      return new Promise(() => {
        switchNetworkLocal(chainId)
      })
    },
    [isConnected, _switchNetworkAsync, isLoading, setLoading, switchNetworkLocal, toastError],
  )

  const switchNetwork = useCallback(
    (chainId: number) => {
      if (isConnected && typeof _switchNetwork === 'function') {
        return _switchNetwork({ chainId })
      }
      return switchNetworkLocal(chainId)
    },
    [_switchNetwork, isConnected, switchNetworkLocal],
  )

  const canSwitch = useMemo(
    () =>
      isConnected
        ? !!_switchNetworkAsync &&
          !(
            typeof window !== 'undefined' &&
            // @ts-ignore // TODO: add type later
            window.ethereum?.isMathWallet
          )
        : true,
    [_switchNetworkAsync, isConnected],
  )

  return {
    ...switchNetworkArgs,
    switchNetwork,
    switchNetworkAsync,
    isLoading,
    canSwitch,
  }
}
