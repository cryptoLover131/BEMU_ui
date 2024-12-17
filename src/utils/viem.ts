import first from 'lodash/first'
import { PublicClient, createPublicClient, fallback, http } from 'viem'

import { CHAINS, ChainId, PUBLIC_NODES } from 'config/chains'

export type CreatePublicClientParams = {
  transportSignal?: AbortSignal
}

export function createViemPublicClients({ transportSignal }: CreatePublicClientParams = {}) {
  return CHAINS.reduce((prev, cur) => {
    return {
      ...prev,
      [cur.id]: createPublicClient({
        chain: cur,
        transport: fallback(
          (PUBLIC_NODES[cur.id] as string[]).map((url) =>
            http(url, {
              timeout: 10_000,
              fetchOptions: {
                signal: transportSignal,
              },
            }),
          ),
          {
            rank: false,
          },
        ),
        batch: {
          multicall: {
            batchSize: 1024 * 200,
            wait: 16,
          },
        },
        pollingInterval: 6_000,
      }),
    }
  }, {} as Record<ChainId, PublicClient>)
}

export const viemClients = createViemPublicClients()

export const getViemClients = createViemPublicClientGetter({ viemClients })

type CreateViemPublicClientGetterParams = {
  viemClients?: Record<ChainId, PublicClient>
} & CreatePublicClientParams

export function createViemPublicClientGetter({
  viemClients: viemClientsOverride,
  ...restParams
}: CreateViemPublicClientGetterParams = {}) {
  const clients = viemClientsOverride || createViemPublicClients(restParams)

  return function getClients({ chainId }: { chainId?: ChainId }): PublicClient {
    return clients[chainId as ChainId]
  }
}

export const CLIENT_CONFIG = {
  batch: {
    multicall: {
      batchSize: 1024 * 200,
      wait: 16,
    },
  },
  pollingInterval: 6_000,
}

export const publicClient = ({ chainId }: { chainId?: ChainId }) => {
  if (chainId && viemClients[chainId]) {
    return viemClients[chainId]
  }
  const httpString = chainId && first(PUBLIC_NODES[chainId]) ? first(PUBLIC_NODES[chainId]) : undefined

  const chain = CHAINS.find((c) => c.id === chainId)

  return createPublicClient({ chain, transport: http(httpString), ...CLIENT_CONFIG })
}
