import { useState, useMemo } from 'react'
import { Currency, CurrencyAmount, Pair, Percent } from 'libraries/swap-sdk'
import {
  Button,
  Text,
  ChevronUpIcon,
  ChevronDownIcon,
  Box,
  Card,
  CardBody,
  Flex,
  CardProps,
  NextLinkFromReactRouter,
} from 'components'
import styled from 'styled-components'
import useTotalSupply from 'hooks/useTotalSupply'
import useBUSDPrice from 'hooks/useBUSDPrice'
import { multiplyPriceByAmount } from 'utils/prices'
import { useAccount } from 'wagmi'
import { useTokenBalance } from '../../state/wallet/hooks'
import { currencyId } from '../../utils/currencyId'
import { unwrappedToken } from '../../utils/wrappedCurrency'
import { AutoColumn } from '../Layout/Column'
import CurrencyLogo from '../Logo/CurrencyLogo'
import { DoubleCurrencyLogo } from '../Logo'
import { RowBetween, RowFixed } from '../Layout/Row'
import Dots from '../Loader/Dots'

const FixedHeightRow = styled(RowBetween)`
  height: 24px;
`

const LightCard = styled(Box)<{
  width?: string
  padding?: string
  border?: string
  borderRadius?: string
}>`
  width: ${({ width }) => width ?? '100%'};
  padding: ${({ padding }) => padding ?? '1.25rem'};
  border-radius: ${({ borderRadius }) => borderRadius ?? '16px'};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
`

interface PositionCardProps extends CardProps {
  pair: Pair
  showUnwrapped?: boolean
  currency0: Currency
  currency1: Currency
  token0Deposited: CurrencyAmount<Currency>
  token1Deposited: CurrencyAmount<Currency>
  totalUSDValue: number
  userPoolBalance: CurrencyAmount<Currency>
  poolTokenPercentage: Percent
}

const useTokensDeposited = ({ pair, totalPoolTokens, userPoolBalance }) => {
  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    totalPoolTokens.quotient >= userPoolBalance.quotient
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false),
        ]
      : [undefined, undefined]

  return [token0Deposited, token1Deposited]
}

const useTotalUSDValue = ({ currency0, currency1, token0Deposited, token1Deposited }) => {
  const token0Price = useBUSDPrice(currency0)
  const token1Price = useBUSDPrice(currency1)

  const token0USDValue =
    token0Deposited && token0Price
      ? multiplyPriceByAmount(token0Price, parseFloat(token0Deposited.toSignificant(6)))
      : null
  const token1USDValue =
    token1Deposited && token1Price
      ? multiplyPriceByAmount(token1Price, parseFloat(token1Deposited.toSignificant(6)))
      : null
  return token0USDValue && token1USDValue ? token0USDValue + token1USDValue : null
}

const usePoolTokenPercentage = ({ userPoolBalance, totalPoolTokens }) => {
  return !!userPoolBalance &&
    !!totalPoolTokens &&
    totalPoolTokens.quotient >= userPoolBalance.quotient
    ? new Percent(userPoolBalance.quotient, totalPoolTokens.quotient)
    : undefined
}

const withLPValuesFactory =
  ({ useLPValuesHook, hookArgFn }) =>
  (Component) =>
  (props) => {
    const { address: account } = useAccount()

    const currency0 = props.showUnwrapped ? props.pair.token0 : unwrappedToken(props.pair.token0)
    const currency1 = props.showUnwrapped ? props.pair.token1 : unwrappedToken(props.pair.token1)

    const userPoolBalance = useTokenBalance(account ?? undefined, props.pair.liquidityToken)

    const totalPoolTokens = useTotalSupply(props.pair.liquidityToken)

    const poolTokenPercentage = usePoolTokenPercentage({ totalPoolTokens, userPoolBalance })

    const args = useMemo(
      () =>
        hookArgFn({
          userPoolBalance,
          pair: props.pair,
          totalPoolTokens,
        }),
      [userPoolBalance, props.pair, totalPoolTokens],
    )

    const [token0Deposited, token1Deposited] = useLPValuesHook(args)

    const totalUSDValue = useTotalUSDValue({ currency0, currency1, token0Deposited, token1Deposited })

    return (
      <Component
        {...props}
        currency0={currency0}
        currency1={currency1}
        token0Deposited={token0Deposited}
        token1Deposited={token1Deposited}
        totalUSDValue={totalUSDValue}
        userPoolBalance={userPoolBalance}
        poolTokenPercentage={poolTokenPercentage}
      />
    )
  }

const withLPValues = withLPValuesFactory({
  useLPValuesHook: useTokensDeposited,
  hookArgFn: ({ pair, userPoolBalance, totalPoolTokens }) => ({ pair, userPoolBalance, totalPoolTokens }),
})

function MinimalPositionCardView({
  currency0,
  currency1,
  token0Deposited,
  token1Deposited,
  totalUSDValue,
  userPoolBalance,
  poolTokenPercentage,
}: PositionCardProps) {
  return (
    <>
      {userPoolBalance && userPoolBalance.quotient > 0 ? (
        <Card>
          <CardBody>
            <AutoColumn gap="16px">
              <FixedHeightRow>
                <RowFixed>
                  <Text color="secondary">
                    LP tokens in your wallet
                  </Text>
                </RowFixed>
              </FixedHeightRow>
              <FixedHeightRow>
                <RowFixed>
                  <DoubleCurrencyLogo currency0={currency0} currency1={currency1} margin size={20} />
                  <Text small color="textSubtle">
                    {currency0.symbol}-{currency1.symbol} LP
                  </Text>
                </RowFixed>
                <RowFixed>
                  <Flex flexDirection="column" alignItems="flex-end">
                    <Text>{userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}</Text>
                    {Number.isFinite(totalUSDValue) && (
                      <Text small color="textSubtle">{`(~${totalUSDValue.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })} USD)`}</Text>
                    )}
                  </Flex>
                </RowFixed>
              </FixedHeightRow>
              <AutoColumn gap="4px">
                <FixedHeightRow>
                  <Text color="textSubtle" small>
                    Share in Trading Pair:
                  </Text>
                  <Text>{poolTokenPercentage ? `${poolTokenPercentage.toFixed(6)}%` : '-'}</Text>
                </FixedHeightRow>
                <FixedHeightRow>
                    <Text color="textSubtle" small>
                      Pooled {currency0.symbol}:
                    </Text>
                    {token0Deposited ? (
                      <RowFixed>
                        <Text ml="6px">{token0Deposited?.toSignificant(6)}</Text>
                      </RowFixed>
                    ) : (
                      '-'
                    )}
                  </FixedHeightRow>
                  <FixedHeightRow>
                    <Text color="textSubtle" small>
                      Pooled {currency1.symbol}:
                    </Text>
                    {token1Deposited ? (
                      <RowFixed>
                        <Text ml="6px">{token1Deposited?.toSignificant(6)}</Text>
                      </RowFixed>
                    ) : (
                      '-'
                    )}
                  </FixedHeightRow>
              </AutoColumn>
            </AutoColumn>
          </CardBody>
        </Card>
      ) : (
        <LightCard>
          <Text fontSize="14px" style={{ textAlign: 'center' }}>
            By adding liquidity you'll earn 0.17% of all trades on this pair proportional to your share in the trading pair. Fees are added to the pair, accrue in real time and can be claimed by withdrawing your liquidity.
          </Text>
        </LightCard>
      )}
    </>
  )
}

function FullPositionCard({
  currency0,
  currency1,
  token0Deposited,
  token1Deposited,
  userPoolBalance,
  poolTokenPercentage,
  ...props
}: PositionCardProps) {
  const [showMore, setShowMore] = useState(false)

  return (
    <Card {...props} mb="0">
      <Flex 
        justifyContent="space-between" 
        role="button" 
        onClick={() => setShowMore(!showMore)} 
        p="8px"
        alignItems="center"
      >
        <Flex flexDirection="column">
          <Flex alignItems="center">
            <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={20} />
            <Text ml="8px">
              {!currency0 || !currency1 ? <Dots>Loading</Dots> : `${currency0.symbol}/${currency1.symbol}`}
            </Text>
          </Flex>
        </Flex>
        <Text fontSize="14px" color="textSubtle">
          {userPoolBalance?.toSignificant(4)}
        </Text>
        {showMore ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </Flex>

      {showMore && (
        <AutoColumn gap="8px" style={{ padding: '8px 8px 0 8px' }}>
          <FixedHeightRow>
              <RowFixed>
                <CurrencyLogo size="20px" currency={currency0} />
                <Text color="textSubtle" ml="4px" small>
                  Pooled { currency0.symbol }:
                </Text>
              </RowFixed>
              {token0Deposited ? (
                <RowFixed>
                  <Text ml="6px" small>{token0Deposited?.toSignificant(6)}</Text>
                </RowFixed>
              ) : (
                '-'
              )}
            </FixedHeightRow>

            <FixedHeightRow>
              <RowFixed>
                <CurrencyLogo size="20px" currency={currency1} />
                <Text color="textSubtle" ml="4px" small>
                  Pooled { currency1.symbol }:
                </Text>
              </RowFixed>
              {token1Deposited ? (
                <RowFixed>
                  <Text ml="6px" small>{token1Deposited?.toSignificant(6)}</Text>
                </RowFixed>
              ) : (
                '-'
              )}
            </FixedHeightRow>
          <FixedHeightRow>
            <Text color="textSubtle" small>Share in Trading Pair</Text>
            <Text>
              {poolTokenPercentage
                ? `${poolTokenPercentage.toFixed(2) === '0.00' ? '<0.01' : poolTokenPercentage.toFixed(2)}%`
                : '-'}
            </Text>
          </FixedHeightRow>

          {userPoolBalance && userPoolBalance.quotient > 0 && (
            <Flex justifyContent="right">
              <Button
                as={NextLinkFromReactRouter}
                to={`/add/${currencyId(currency0)}/${currencyId(currency1)}?step=1`}
                variant="text"
                width="100px"
                height="36px"
                mr="10px"
              >
                Add
              </Button>
              <Button
                as={NextLinkFromReactRouter}
                to={`/remove/${currencyId(currency0)}/${currencyId(currency1)}`}
                variant="text"
                width="120px"
                height="36px"
              >
                Remove
              </Button>
            </Flex>
          )}
        </AutoColumn>
      )}
    </Card>
  )
}

export const MinimalPositionCard = withLPValues(MinimalPositionCardView)

export default withLPValues(FullPositionCard)
