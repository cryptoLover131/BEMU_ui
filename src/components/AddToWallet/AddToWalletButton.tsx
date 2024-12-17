import {
  BinanceChainIcon,
  Button,
  ButtonProps,
  CoinbaseWalletIcon,
  MetamaskIcon,
  OperaIcon,
  TokenPocketIcon,
  TrustWalletIcon,
} from 'components'
import { Address } from 'viem'
import { useAccount, useWalletClient } from 'wagmi'
import { BAD_SRCS } from '../Logo/constants'

export enum AddToWalletTextOptions {
  NO_TEXT,
  TEXT,
  TEXT_WITH_ASSET,
}

export interface AddToWalletButtonProps {
  tokenAddress?: string
  tokenSymbol?: string
  tokenDecimals?: number
  tokenLogo?: string
  textOptions?: AddToWalletTextOptions
  marginTextBetweenLogo?: string
}

const Icons = {
  // TODO: Brave
  Binance: BinanceChainIcon,
  'Coinbase Wallet': CoinbaseWalletIcon,
  Opera: OperaIcon,
  TokenPocket: TokenPocketIcon,
  'Trust Wallet': TrustWalletIcon,
  MetaMask: MetamaskIcon,
}

const getWalletText = (textOptions: AddToWalletTextOptions, tokenSymbol: string | undefined) => {
  return (
    textOptions !== AddToWalletTextOptions.NO_TEXT &&
    (textOptions === AddToWalletTextOptions.TEXT
      ? 'Add to Wallet'
      : `Add ${tokenSymbol} to Wallet`
    )
  )
}

const getWalletIcon = (marginTextBetweenLogo: string, name?: string) => {
  const iconProps = {
    width: '16px',
    ...(marginTextBetweenLogo && { ml: marginTextBetweenLogo }),
  }
  if (name && Icons[name]) {
    const Icon = Icons[name]
    return <Icon {...iconProps} />
  }
  return <MetamaskIcon {...iconProps} />
}

const AddToWalletButton: React.FC<AddToWalletButtonProps & ButtonProps> = ({
  tokenAddress,
  tokenSymbol,
  tokenDecimals,
  tokenLogo,
  textOptions = AddToWalletTextOptions.NO_TEXT,
  marginTextBetweenLogo = '0px',
  ...props
}) => {
  const { connector, isConnected } = useAccount()
  const { data: walletClient } = useWalletClient()
  if (!walletClient) return null
  if (connector && connector.name === 'Binance') return null
  if (!(connector && isConnected)) return null

  return (
    <Button
      {...props}
      onClick={() => {
        const image = tokenLogo ? (BAD_SRCS[tokenLogo] ? undefined : tokenLogo) : undefined
        if (!tokenAddress || !tokenSymbol || !tokenDecimals) return
        walletClient.watchAsset({
          // TODO: Add more types
          type: 'ERC20',
          options: {
            address: tokenAddress as Address,
            symbol: tokenSymbol,
            image,
            decimals: tokenDecimals,
          },
        })
      }}
    >
      {getWalletText(textOptions, tokenSymbol)}
      {getWalletIcon(marginTextBetweenLogo, connector?.name)}
    </Button>
  )
}

export default AddToWalletButton
