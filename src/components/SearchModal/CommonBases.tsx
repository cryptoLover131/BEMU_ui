import { ChainId } from 'config/chains'
import { Currency, Token } from 'libraries/swap-sdk'
import { Text } from 'components'
import styled from 'styled-components'
import { SUGGESTED_BASES } from 'config/constants/exchange'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { AutoColumn } from '../Layout/Column'
import { CurrencyLogo } from '../Logo'

const ButtonWrapper = styled.div`
  display: inline-block;
  vertical-align: top;
  margin-right: 10px;
`

const BaseWrapper = styled.div<{ disable?: boolean }>`
  border: 1px solid ${({ theme, disable }) => (disable ? 'transparent' : theme.colors.inputSecondary)};
  border-radius: 18px;
  display: flex;
  padding: 5px 10px 5px 6px;
  align-items: center;
  :hover {
    cursor: ${({ disable }) => !disable && 'pointer'};
    background-color: ${({ theme, disable }) => !disable && theme.colors.input};
  }
  background-color: ${({ theme, disable }) => disable && theme.colors.input};
`

const RowWrapper = styled.div`
  white-space: nowrap;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    display: none;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
`

export default function CommonBases({
  chainId,
  onSelect,
  selectedCurrency
}: {
  chainId?: ChainId
  selectedCurrency?: Currency | null
  onSelect: (currency: Currency) => void
}) {
  const native = useNativeCurrency()
  const FIRST_LINE = chainId ? [SUGGESTED_BASES[chainId][0], SUGGESTED_BASES[chainId][1]] : []
  const SECOND_LINE_ETH = chainId ? [SUGGESTED_BASES[chainId][2], SUGGESTED_BASES[chainId][3]] : []
  // const THIRD_LINE = chainId ? [SUGGESTED_BASES[chainId][6], SUGGESTED_BASES[chainId][7]] : []

  const isNativeSelected = selectedCurrency?.equals(native)

  return (
    <AutoColumn gap="md">
      <RowWrapper>
        <ButtonWrapper key="buttonBase#native">
          <BaseWrapper onClick={() => !isNativeSelected && onSelect(native)} disable={isNativeSelected}>
            <CurrencyLogo currency={native} style={{ marginRight: 8, borderRadius: '50%' }} />
            <Text>{native.symbol}</Text>
          </BaseWrapper>
        </ButtonWrapper>
        {(chainId ? FIRST_LINE || [] : []).map((token: Token) => {
          const selected = selectedCurrency?.equals(token)
          return (
            <ButtonWrapper key={`buttonBase#${token.address}`}>
              <BaseWrapper onClick={() => !selected && onSelect(token)} disable={selected}>
                <CurrencyLogo currency={token} style={{ marginRight: 8, borderRadius: '50%' }} />
                <Text>{token.symbol}</Text>
              </BaseWrapper>
            </ButtonWrapper>
          )
        })}
      </RowWrapper>
      <RowWrapper>
        {(chainId ? SECOND_LINE_ETH || [] : []).map((token: Token) => {
          const selected = selectedCurrency?.equals(token)
          return (
            <ButtonWrapper key={`buttonBase#${token.address}`}>
              <BaseWrapper onClick={() => !selected && onSelect(token)} disable={selected}>
                <CurrencyLogo currency={token} style={{ marginRight: 8, borderRadius: '50%' }} />
                <Text>{token.symbol}</Text>
              </BaseWrapper>
            </ButtonWrapper>
          )
        })}
      </RowWrapper>
      {/* <RowWrapper>
        {(chainId ? THIRD_LINE || [] : []).map((token: Token) => {
          const selected = selectedCurrency?.equals(token)
          return (
            <ButtonWrapper key={`buttonBase#${token.address}`}>
              <BaseWrapper onClick={() => !selected && onSelect(token)} disable={selected}>
                <CurrencyLogo currency={token} style={{ marginRight: 8, borderRadius: '50%' }} />
                <Text>{token.symbol}</Text>
              </BaseWrapper>
            </ButtonWrapper>
          )
        })}
      </RowWrapper> */}
    </AutoColumn>
  )
}
