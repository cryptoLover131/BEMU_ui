import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import { Skeleton } from 'components'
import { useActiveChainId } from 'hooks/useActiveChainId'
import ApyButton from './ApyButton'

export interface AprProps {
  value: string
  multiplier: string
  pid: number
  lpLabel: string
  lpSymbol: string
  lpRewardsApr: number
  lpTokenPrice: BigNumber
  tokenAddress?: string
  quoteTokenAddress?: string
  cakePrice: BigNumber
  originalValue: number
  hideButton?: boolean
  strikethrough?: boolean
  useTooltipText?: boolean
  isTokenOnly?: boolean
}

const Container = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};

  button {
    width: 20px;
    height: 20px;

    svg {
      path {
        fill: ${({ theme }) => theme.colors.textSubtle};
      }
    }
  }
`

const AprWrapper = styled.div`
  // min-width: 60px;
  text-align: left;
`

const Apr: React.FC<React.PropsWithChildren<AprProps>> = ({
  value,
  pid,
  lpLabel,
  lpSymbol,
  lpTokenPrice,
  multiplier,
  tokenAddress,
  quoteTokenAddress,
  cakePrice,
  originalValue,
  hideButton = false,
  strikethrough,
  lpRewardsApr,
  useTooltipText = true,
  isTokenOnly
}) => {
  const { chainId } = useActiveChainId()
  const liquidityUrlPathParts = getLiquidityUrlPathParts({ quoteTokenAddress, tokenAddress, chainId })
  const addLiquidityUrl = `add/${liquidityUrlPathParts}`
  return originalValue !== 0 ? (
    <Container>
      {originalValue ? (
        <ApyButton
          variant={hideButton ? 'text' : 'text-and-button'}
          pid={pid}
          lpSymbol={lpSymbol}
          lpLabel={lpLabel}
          lpTokenPrice={lpTokenPrice}
          multiplier={multiplier}
          cakePrice={cakePrice}
          apr={originalValue}
          displayApr={value}
          lpRewardsApr={lpRewardsApr}
          addLiquidityUrl={addLiquidityUrl}
          strikethrough={strikethrough}
          useTooltipText={useTooltipText}
          hideButton={hideButton}
          isTokenOnly={isTokenOnly ?? false}
        />
      ) : (
        <AprWrapper>
          <Skeleton width={60} />
        </AprWrapper>
      )}
    </Container>
  ) : (
    <Container>
      <AprWrapper>{originalValue}%</AprWrapper>
    </Container>
  )
}

export default Apr
