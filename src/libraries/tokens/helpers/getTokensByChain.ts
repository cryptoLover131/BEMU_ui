import { ChainId } from 'config/chains'
import { Token } from 'libraries/swap-sdk-core'

import { allTokens } from '../allTokens'

export function getTokensByChain(chainId?: ChainId): Token[] {
  if (!chainId) {
    return []
  }

  const tokenMap = allTokens[chainId]
  return Object.values(tokenMap)
}
