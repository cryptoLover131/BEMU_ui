import { Text, LinkExternal } from 'components'
import { FarmWithStakedValue } from 'libraries/farms'
import { useActiveChainId } from 'hooks/useActiveChainId'
import styled, { css, keyframes } from 'styled-components'
import { getBlockExploreLink } from 'utils'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'

import { 
  FarmTableLiquidityProps,
} from '../types'

import { AprProps } from './Apr'
import { HarvestAction, HarvestActionContainer } from './HarvestAction'
import StakedAction, { StakedContainer } from './StakedAction'

export interface ActionPanelProps {
  apr: AprProps
  liquidity?: FarmTableLiquidityProps
  details: FarmWithStakedValue
  userDataReady: boolean
  expanded: boolean
}

const expandAnimation = keyframes`
  from {
    max-height: 0px;
  }
  to {
    max-height: 700px;
  }
`

const collapseAnimation = keyframes`
  from {
    max-height: 700px;
  }
  to {
    max-height: 0px;
  }
`

const Container = styled.div<{ expanded }>`
  animation: ${({ expanded }) =>
    expanded
      ? css`
          ${expandAnimation} 300ms linear forwards
        `
      : css`
          ${collapseAnimation} 300ms linear forwards
        `};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.dropdown};
  display: flex;
  width: 100%;
  flex-direction: column-reverse;
  padding: 8px 32px;

  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
    align-items: center;
    padding: 8px 48px;
  }
`

const StyledLinkExternal = styled(LinkExternal)`
  font-weight: 400;
`

const StakeContainer = styled.div`
  color: ${({ theme }) => theme.colors.text};
  align-items: center;
  display: flex;
  justify-content: space-between;

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: flex-start;
  }
`

const ActionContainer = styled.div`
  display: flex;
  flex-direction: column;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    align-items: center;
    flex-grow: 1;
    flex-basis: 0;
    flex-wrap: wrap;
  }
`

const InfoContainer = styled.div`
  min-width: 200px;
`

const ActionPanel: React.FunctionComponent<React.PropsWithChildren<ActionPanelProps>> = ({
  details,
  apr,
  userDataReady,
  expanded,
}) => {
  const { chainId } = useActiveChainId()

  const farm = details

  const { quoteToken, token } = farm
  const lpLabel = farm.lpSymbol && farm.lpSymbol.toUpperCase().replace('PANCAKE', '')
  const liquidityUrlPathParts = getLiquidityUrlPathParts({
    quoteTokenAddress: quoteToken.address,
    tokenAddress: token.address,
    chainId,
  })
  const { lpAddress } = farm
  const bsc = getBlockExploreLink(lpAddress, 'address', chainId)

  return (
    <Container expanded={expanded}>
      <InfoContainer>
        <StakeContainer>
          <StyledLinkExternal href={farm.isTokenOnly ? `/swap?outputCurrency=${farm.token.address}` : `/add/${liquidityUrlPathParts}`}>
            <Text fontSize="14px">Get {lpLabel}</Text>
          </StyledLinkExternal>
        </StakeContainer>
        <StyledLinkExternal href={bsc}>
          <Text fontSize="14px">View Contract</Text>
        </StyledLinkExternal>
      </InfoContainer>
      <ActionContainer>
        <HarvestActionContainer {...farm} userDataReady={userDataReady}>
          {(props) => <HarvestAction {...props} />}
        </HarvestActionContainer>
        <StakedContainer {...farm} userDataReady={userDataReady} lpLabel={lpLabel} displayApr={apr.value}>
          {(props) => <StakedAction {...props} />}
        </StakedContainer>
      </ActionContainer>
    </Container>
  )
}

export default ActionPanel
