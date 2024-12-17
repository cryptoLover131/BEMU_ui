import { useMemo } from 'react'
import styled from 'styled-components'
import { Text, Flex, Button, NextLinkFromReactRouter, OpenNewIcon, Box} from 'components'
import { useAccount } from 'wagmi'
import FullPositionCard from 'components/PositionCard'
import { useTokenBalancesWithLoadingIndicator } from 'state/wallet/hooks'
import { usePairs, PairState } from 'hooks/usePairs'
import { toV2LiquidityToken, useTrackedTokenPairs } from 'state/user/hooks'
import Dots from 'components/Loader/Dots'
import { AppBody } from 'components/App'
import Page from 'components/Layout/Page'
import CurrencyInputHeader from 'views/Swap/components/CurrencyInputHeader'
import { ArbitrumBridgeBox } from 'views/Swap/components/styleds'

const Body = styled.div`
  border: 1px solid ${({theme}) => theme.colors.input};
	border-radius: 8px;
`

export default function Pool() {
  const { address: account } = useAccount()

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()

  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map((tokens) => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs],
  )
  const liquidityTokens = useMemo(
    () => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken),
    [tokenPairsWithLiquidityTokens],
  )
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens,
  )

  // const stablePairs = useLPTokensWithBalanceByAccount(account)

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0'),
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances],
  )

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances ||
    v2Pairs?.length < liquidityTokensWithBalances.length ||
    (v2Pairs?.length && v2Pairs.every(([pairState]) => pairState === PairState.LOADING))
  const allV2PairsWithLiquidity = v2Pairs
    ?.filter(([pairState, pair]) => pairState === PairState.EXISTS && Boolean(pair))
    .map(([, pair]) => pair)

  const renderBody = () => {
    if (!account) {
      return (
        <Text color="textSubtle" textAlign="center">
          Connect to a wallet to view your liquidity.
        </Text>
      )
    }
    if (v2IsLoading) {
      return (
        <Text color="textSubtle" textAlign="center">
          <Dots>Loading</Dots>
        </Text>
      )
    }

    let positionCards : any[] = []

    if (allV2PairsWithLiquidity?.length > 0) {
      positionCards = allV2PairsWithLiquidity.map((v2Pair, index) => (
        v2Pair ? <Body
          key={`liquidity-${v2Pair.liquidityToken.address}`}
        >
					<FullPositionCard
						pair={v2Pair}
						mb={index < allV2PairsWithLiquidity.length - 1 ? '16px' : 0}
					/>
				</Body> : <></>
      ))
    }

    if (positionCards?.length > 0) {
      return positionCards
    }

    return (
      <Text color="textSubtle" textAlign="center">
        No liquidity found.
      </Text>
    )
  }

  return (
    <Page>
      <Flex justifyContent="center" mt="40px">
        <AppBody>
          <CurrencyInputHeader
            title='Pool'
          />
          {renderBody()}
					<Flex justifyContent="space-between" mt="20px"> 
						<Button 
							as={NextLinkFromReactRouter}
							to='/find'
							width="48%" 
							height="48px"
							variant='secondary'
						>
							Import Pool
						</Button>
						<Button 
							as={NextLinkFromReactRouter}
							to='/add' 
							width="48%" 
							// startIcon={<AddIcon color="text" />}
							height="48px"
							variant='primary'
						>
							Add Liquidity
						</Button>
					</Flex>
        </AppBody>
      </Flex>
      <Flex justifyContent="center" mt="10px">
        <ArbitrumBridgeBox
          as={NextLinkFromReactRouter}
          to="https://app.uniswap.org/pools/v2?chain=base"
          target='_blink'
          p="12px"
        >
          <Flex alignItems="center">
            <img 
              src='/images/uniswap-logo.png' 
              width="40px" 
              height="40px" 
              alt="bridgeIcon" 
              style={{borderRadius: "12px"}}
            />
            <Box ml="10px">
              <Text fontSize="16px" lineHeight="1.2" color="primaryDark">Pool is based on the Uniswap V2 Router.</Text>
            </Box>
          </Flex>
          <Flex mr="10px">
            <OpenNewIcon color="primaryDark" />
          </Flex>
        </ArbitrumBridgeBox>
      </Flex>
    </Page>
  )
}
