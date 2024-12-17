import { GTOKEN } from 'libraries/tokens'
import { useFarmUser } from 'state/farms/hooks'
import { TokenImage, TokenPairImage } from 'components/TokenImage'
import { ChevronRightIcon, Flex } from 'components'
import { FarmTableFarmTokenInfoProps } from '../types'
import FarmTokenInfo from './FarmTokenInfo'

const Farm: React.FunctionComponent<React.PropsWithChildren<FarmTableFarmTokenInfoProps>> = ({
  token,
  quoteToken,
  label,
  pid,
  isReady,
  isTokenOnly
}) => {
  const { stakedBalance } = useFarmUser(pid)

  return (
    <FarmTokenInfo
      pid={pid}
      label={label}
      token={token}
      quoteToken={quoteToken}
      isReady={isReady}
      stakedBalance={stakedBalance}
      isTokenOnly={isTokenOnly}
    >
      {isTokenOnly ?
        <Flex width="100%" alignItems="center">
          <TokenImage width={36} height={36} token={token} mr="2px" />
          <ChevronRightIcon />
          <TokenImage width={36} height={36} token={GTOKEN[token.chainId]} />
        </Flex>
        :
        <Flex width="100%" alignItems="center">
          <TokenPairImage width={40} height={40} variant="inverted" primaryToken={token} secondaryToken={quoteToken} />
          <ChevronRightIcon />
          <TokenImage width={36} height={36} token={GTOKEN[token.chainId]} />
        </Flex>
      }
    </FarmTokenInfo>
  )
}

export default Farm
