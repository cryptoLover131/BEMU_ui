import styled from "styled-components";
import { GTOKEN } from 'libraries/tokens'
import { TokenImage, TokenPairImage } from 'components/TokenImage'
import { Flex, ChevronRightIcon } from 'components'
import { FarmTableFarmTokenInfoProps } from '../types'

const Container = styled.div`
  padding-left: 16px;
  display: flex;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-left: 32px;
  }
`;

const TokenInfo: React.FunctionComponent<React.PropsWithChildren<FarmTableFarmTokenInfoProps>> = ({
  token,
  quoteToken,
  isTokenOnly
}) => {
  return (
    <Container>
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
    </Container>
  )
}

export default TokenInfo
