import memoize from 'lodash/memoize'
import { Token } from 'libraries/swap-sdk'
import { ChainId } from 'config/chains'
import { safeGetAddress } from 'utils'
import { isAddress } from 'viem'

const mapping = {
  [ChainId.BSC]: 'smartchain',
  [ChainId.ETHEREUM]: 'ethereum',
  [ChainId.POLYGON]: 'polygon',
  [ChainId.ARBITRUM]: 'arbitrum',
  [ChainId.SHIMMER]: 'shimmerevm',
  [ChainId.BASE]: 'base'
}

const getTokenLogoURL = memoize(
  (token?: Token) => {
    if (token && mapping[token.chainId] && isAddress(token.address)) {
      return `/images/${token.chainId}/tokens/${safeGetAddress(
        token.address
      )}.png`
    }
    return null
  },
  (t) => `${t?.chainId}#${t?.address}`,
)

export const getTokenLogoURLByAddress = memoize(
  (address?: string, chainId?: number) => {
    if (address && chainId && mapping[chainId] && isAddress(address)) {
      return `https://assets-cdn.trustwallet.com/blockchains/${mapping[chainId]}/assets/${safeGetAddress(
        address,
      )}/logo.png`
    }
    return null
  },
  (address, chainId) => `${chainId}#${address}`,
)

export default getTokenLogoURL
