import { memo } from 'react'
import Image from 'next/image'
import { isChainSupported } from 'utils/wagmi'
import { HelpIcon } from '../Svg'

export const ChainLogo = memo(
  ({ chainId, width = 24, height = 24 }: { chainId: number; width?: number; height?: number }) => {
    if (isChainSupported(chainId)) {
      return (
        <Image
          alt={`chain-${chainId}`}
          style={{ maxHeight: `${height}px` }}
          src={`/images/chains/${chainId === 42161 ? "42161-1" : chainId}.png`}
          width={width}
          height={height}
          unoptimized
        />
      )
    }

    return <HelpIcon width={width} height={height} />
  },
)
