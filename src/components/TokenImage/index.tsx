import {
  TokenPairImage as UIKitTokenPairImage,
  TokenPairImageProps as UIKitTokenPairImageProps,
  TokenImage as UIKitTokenImage,
  ImageProps,
} from 'components'
import { Token} from 'libraries/swap-sdk'
import { SerializedWrappedToken } from 'libraries/token-lists'

interface TokenPairImageProps extends Omit<UIKitTokenPairImageProps, 'primarySrc' | 'secondarySrc'> {
  primaryToken: Token
  secondaryToken: Token
}

const getImageUrlFromToken = (token: Token) => {
  const address = token?.isNative ? token.wrapped.address : token.address
  return `/images/${token.chainId}/tokens/${address}.png`
}

export const TokenPairImage: React.FC<React.PropsWithChildren<TokenPairImageProps>> = ({
  primaryToken,
  secondaryToken,
  ...props
}) => {
  return (
    <UIKitTokenPairImage
      primarySrc={getImageUrlFromToken(primaryToken)}
      secondarySrc={getImageUrlFromToken(secondaryToken)}
      {...props}
    />
  )
}

interface TokenImageProps extends ImageProps {
  token: Token
}

export const TokenImage: React.FC<React.PropsWithChildren<TokenImageProps>> = ({ token, ...props }) => {
  return <UIKitTokenImage src={getImageUrlFromToken(token)} {...props} />
}



interface STokenPairImageProps extends Omit<UIKitTokenPairImageProps, 'primarySrc' | 'secondarySrc'> {
  primaryToken: SerializedWrappedToken
  secondaryToken: SerializedWrappedToken
}

const getImageUrlFromSToken = (token?: SerializedWrappedToken) => {
  return `/images/${token?.chainId}/tokens/${token?.address}.png`
}

export const STokenPairImage: React.FC<React.PropsWithChildren<STokenPairImageProps>> = ({
  primaryToken,
  secondaryToken,
  ...props
}) => {
  return (
    <UIKitTokenPairImage
      primarySrc={getImageUrlFromSToken(primaryToken)}
      secondarySrc={getImageUrlFromSToken(secondaryToken)}
      {...props}
    />
  )
}

interface STokenImageProps extends ImageProps {
  token?: SerializedWrappedToken
}

export const STokenImage: React.FC<React.PropsWithChildren<STokenImageProps>> = ({ token, ...props }) => {
  return <UIKitTokenImage src={getImageUrlFromSToken(token)} {...props} />
}
