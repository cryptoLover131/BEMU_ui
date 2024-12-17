import { Currency } from 'libraries/swap-sdk'
import { ChainId } from 'config/chains'
import { BinanceIcon } from 'components/Svg'
import { TokenLogo } from 'components/TokenLogo'
import { useMemo } from 'react'
import { WrappedTokenInfo } from 'libraries/token-lists'
import styled from 'styled-components'
import useHttpLocations from 'hooks/useHttpLocations'
import getTokenLogoURL from '../../utils/getTokenLogoURL'

const StyledLogo = styled(TokenLogo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: 50%;
`

interface LogoProps {
  currency?: Currency | null
  size?: string
  style?: React.CSSProperties
}

export function FiatLogo({ currency, size = '24px', style }: LogoProps) {
  return (
    <StyledLogo
      size={size}
      srcs={[`/images/currencies/${currency?.symbol?.toLowerCase()}.png`]}
      width={size}
      style={style}
    />
  )
}

export default function CurrencyLogo({ currency, size = '24px', style }: LogoProps) {
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)

  const srcs: string[] = useMemo(() => {
    if (currency?.isNative) return []

    if (currency?.isToken) {
      const tokenLogoURL = getTokenLogoURL(currency)

      if (currency instanceof WrappedTokenInfo) {
        if (!tokenLogoURL) return [...uriLocations]
        return [...uriLocations, tokenLogoURL]
      }
      if (!tokenLogoURL) return []
      return [tokenLogoURL]
    }
    return []
  }, [currency, uriLocations])

  if (currency?.isNative) {
    if (currency.chainId === ChainId.BSC) {
      return <BinanceIcon width={size} style={style} />
    }
    return (
      <StyledLogo size={size} srcs={[`/images/chains/${currency.chainId}.png`]} width={size} style={style} />
    )
  }

  // wsmr on shimmer evm
  if (currency && currency.wrapped.address === "0xBEb654A116aeEf764988DF0C6B4bf67CC869D01b" && currency.chainId === 148) {
    return <StyledLogo size={size} srcs={[`/images/148/tokens/0xBEb654A116aeEf764988DF0C6B4bf67CC869D01b.png`]} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
  }

  return <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
}
