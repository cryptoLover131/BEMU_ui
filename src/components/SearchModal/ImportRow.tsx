import { CSSProperties } from 'react'
import { Currency, Token } from 'libraries/swap-sdk'
// import { Button, Text, CheckmarkCircleIcon, useMatchBreakpoints, Flex, ListLogo } from '@pancakeswap/uikit'
import { Button, Text, Flex, CheckmarkCircleIcon } from 'components'
import { useMatchBreakpoints } from 'contexts'
import { ListLogo } from 'widgets/ListLogo'
import { AutoRow, RowFixed } from 'components/Layout/Row'
import { AutoColumn } from 'components/Layout/Column'
import CurrencyLogo from 'components/Logo/CurrencyLogo'
import { useCombinedInactiveList } from 'state/lists/hooks'
import styled from 'styled-components'
import { useIsUserAddedToken, useIsTokenActive } from 'hooks/Tokens'

const TokenSection = styled.div<{ dim?: boolean }>`
  padding: 4px 20px;
  height: 56px;
  display: grid;
  grid-template-columns: auto minmax(auto, 1fr) auto;
  grid-gap: 10px;
  align-items: center;

  opacity: ${({ dim }) => (dim ? '0.4' : '1')};

  ${({ theme }) => theme.mediaQueries.md} {
    grid-gap: 16px;
  }
`

const CheckIcon = styled(CheckmarkCircleIcon)`
  height: 16px;
  width: 16px;
  margin-right: 6px;
  stroke: ${({ theme }) => theme.colors.success};
`

const NameOverflow = styled(Flex)`
  white-space: nowrap;
  overflow: hidden;
  align-items: center;
  text-overflow: ellipsis;
  max-width: 210px;
  gap: 8px;
`

export default function ImportRow({
  token,
  style,
  dim,
  onCurrencySelect,
  showImportView,
  setImportToken,
}: {
  token: Token
  style?: CSSProperties
  dim?: boolean
  onCurrencySelect?: (currency: Currency) => void
  showImportView: () => void
  setImportToken: (token: Token) => void
}) {
  // globals
  const { isMobile } = useMatchBreakpoints()

  // check if token comes from list
  const inactiveTokenList = useCombinedInactiveList()
  const list = token?.chainId && inactiveTokenList?.[token.chainId]?.[token.address]?.list

  // check if already active on list or local storage tokens
  const isAdded = useIsUserAddedToken(token)
  const isActive = useIsTokenActive(token)

  return (
    <TokenSection
      style={style}
      variant="text"
      as={isActive && onCurrencySelect ? Button : 'a'}
      onClick={() => {
        if (isActive) {
          onCurrencySelect?.(token)
        }
      }}
    >
      <CurrencyLogo currency={token} size={isMobile ? '20px' : '24px'} style={{ opacity: dim ? '0.6' : '1' }} />
      <AutoColumn gap="4px" style={{ opacity: dim ? '0.6' : '1' }}>
        <AutoRow>
          <NameOverflow title={token.name}>
            <Text ellipsis color="textDisabled" fontSize="14px">
              {token.symbol}
            </Text>
            <Text ellipsis color="textDisabled" fontSize="12px">
              {token.name}
            </Text>
          </NameOverflow>
        </AutoRow>
        {list && list.logoURI && (
          <RowFixed>
            <Text fontSize={isMobile ? '10px' : '14px'} mr="4px" color="textSubtle">
              via {list.name}
            </Text>
            <ListLogo logoURI={list.logoURI} size="12px" />
          </RowFixed>
        )}
      </AutoColumn>
      {!isActive && !isAdded ? (
        <Button
          scale={isMobile ? 'sm' : 'md'}
          width="fit-content"
          onClick={() => {
            if (setImportToken) {
              setImportToken(token)
            }
            showImportView()
          }}
        >
          Import
        </Button>
      ) : (
        <RowFixed style={{ minWidth: 'fit-content' }}>
          <CheckIcon />
          <Text color="success">Active</Text>
        </RowFixed>
      )}
    </TokenSection>
  )
}
