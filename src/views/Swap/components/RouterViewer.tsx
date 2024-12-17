import { Currency, Pair } from 'libraries/swap-sdk'
import { Box, Flex, Text } from 'components'
import { CurrencyLogo } from 'components/Logo'
import styled from 'styled-components'

const RouterBox = styled(Flex)`
  position: relative;
  flex-direction: row;
  min-width: 300px;
  min-height: auto;
  &:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 3px;
    // border-left: 3px dotted ${({ theme }) => theme.colors.backgroundDisabled};
    border-top: 3px dotted ${({ theme }) => theme.colors.backgroundDisabled};
    transform: translateX(-50%);
    z-index: 1;
  }
`
const RouterPoolBox = styled(Box)`
  position: relative;
  border-radius: 50px;
  display: flex;
  flex-direction: row;
  padding: 4px 8px;
  background-color: ${({ theme }) => theme.colors.backgroundDisabled};
  z-index: 2;
  svg,
  img {
    &:first-child {
      margin-bottom: 2px;
      ${({ theme }) => theme.mediaQueries.md} {
        margin-bottom: 0px;
        margin-right: 2px;
      }
    }
  }
  &.isStableSwap {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  }
`

const CurrencyLogoWrapper = styled.div`
  position: relative;
  height: 24px;
  width: 24px;
  border-radius: 50%;
  z-index: 2;
`

interface RouterViewerProps {
  inputCurrency?: Currency
  outputCurrency?: Currency
  pairs?: Pair[]
  path?: Currency[]
}

export const RouterViewer: React.FC<RouterViewerProps> = ({ pairs, path, inputCurrency, outputCurrency }) => {
  return (
    <Box>
      <RouterBox justifyContent="space-between" alignItems="center">
        <CurrencyLogoWrapper>
          <CurrencyLogo size="24px" currency={inputCurrency} />
        </CurrencyLogoWrapper>
        {pairs &&
          path &&
          pairs.map((p, index) => {
            return (
              <RouterPoolBox
                key={`tradingPairIds${p.liquidityToken.address}`}
                className={undefined}
              >
                <CurrencyLogo size="20px" currency={index === 0 ? inputCurrency : path[index]} />
                <CurrencyLogo size="20px" currency={index === pairs.length - 1 ? outputCurrency : path[index + 1]} />
              </RouterPoolBox>
            )
          })}
        <CurrencyLogoWrapper>
          <CurrencyLogo size="24px" currency={outputCurrency} />
        </CurrencyLogoWrapper>
      </RouterBox>
      <Text fontSize="12px" mt="8px">Routing through these tokens resulted in the best price for your trade.</Text>
    </Box>
  )
}
