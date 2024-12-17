import { useEffect, useCallback, useState, useMemo, useRef } from 'react'
import BigNumber from 'bignumber.js'
import { useAccount } from 'wagmi'
import { Text, Flex, Loading, SearchInput, Select, OptionProps, ButtonMenu, ButtonMenuItem } from 'components'
import styled from 'styled-components'
import Page from 'components/Layout/Page'
import { GTOKEN } from 'libraries/tokens'
import { useFarms, usePollFarmsWithUserData } from 'state/farms/hooks'
import useBUSDPrice from 'hooks/useBUSDPrice'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import { DeserializedFarm, FarmWithStakedValue, filterFarmsByQuery } from 'libraries/farms'
import { BIG_ZERO } from 'utils/bigNumber'
import { getFarmApr } from 'utils/apr'
import orderBy from 'lodash/orderBy'
import { useUserFarmStakedOnly } from 'state/user/hooks'
import { useRouter } from 'next/router'
import { useActiveChainId } from 'hooks/useActiveChainId'
import Table from './components/FarmTable'
import { FarmTabButtons } from './components/FarmTabButtons'
import { FarmsContext } from './context'

const ControlContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;

  justify-content: space-between;
  flex-direction: column;
  margin-bottom: 16px;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    flex-wrap: wrap;
    padding: 16px 0;
    margin-bottom: 0;
  }
`

const LabelWrapper = styled.div`
  > ${Text} {
    font-size: 12px;
  }
`

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 0px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: auto;
    padding: 0;
    margin-top: 12px;
  }
`

const ViewControls = styled.div`
  flex-wrap: wrap;
  justify-content: space-between;
  display: flex;
  align-items: center;
  width: 100%;

  > div {
    padding: 8px 0px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: flex-start;
    width: auto;

    > div {
      padding: 0;
    }
    margin-top: 12px;
  }
`

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 16px;
  }
`;

const NUMBER_OF_FARMS_VISIBLE = 12

const Farms = () => {
  const { pathname, query: urlQuery } = useRouter()
  const { chainId } = useActiveChainId()
  const { data: farmsLP, userDataLoaded, poolLength, regularCakePerBlock } = useFarms()

  const _cakePrice = useBUSDPrice(GTOKEN[chainId])

  const cakePrice = useMemo(() => (_cakePrice ? new BigNumber(_cakePrice.toSignificant(6)) : BIG_ZERO), [_cakePrice])

  const [_query, setQuery] = useState('')
  const normalizedUrlSearch = useMemo(() => (typeof urlQuery?.search === 'string' ? urlQuery.search : ''), [urlQuery])
  const query = normalizedUrlSearch && !_query ? normalizedUrlSearch : _query

  const { address: account } = useAccount()
  const [sortOption, setSortOption] = useState('hot')
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const chosenFarmsLength = useRef(0)

  const isArchived = pathname.includes('archived')
  const isInactive = pathname.includes('history')
  const isActive = !isInactive && !isArchived

  usePollFarmsWithUserData()

  // Users with no wallet connected should see 0 as Earned amount
  // Connected users should see loading indicator until first userData has loaded
  const userDataReady = !account || (!!account && userDataLoaded)

  const [stakedOnly, setStakedOnly] = useUserFarmStakedOnly(isActive)
  const activeFarms = farmsLP.filter(
    (farm) =>
      farm.multiplier !== '0X' &&
      (!poolLength || poolLength > farm.pid),
  )

  const inactiveFarms = farmsLP.filter(
    (farm) =>
      (farm.pid !== 0 && farm.multiplier === '0X'),
  )
  const archivedFarms = farmsLP

  const stakedOnlyFarms = activeFarms.filter(
    (farm) =>
      farm.userData &&
      new BigNumber(farm.userData.stakedBalance).isGreaterThan(0)
  )

  const stakedInactiveFarms = inactiveFarms.filter(
    (farm) =>
      farm.userData &&
      new BigNumber(farm.userData.stakedBalance).isGreaterThan(0)
  )

  const stakedArchivedFarms = archivedFarms.filter(
    (farm) =>
      farm.userData &&
      new BigNumber(farm.userData.stakedBalance).isGreaterThan(0)
  )

  const farmsList = useCallback(
    (farmsToDisplay: DeserializedFarm[]): FarmWithStakedValue[] => {
      const farmsToDisplayWithAPR: FarmWithStakedValue[] = farmsToDisplay.map((farm) => {
        if (!farm.lpTotalInQuoteToken || !farm.quoteTokenPriceBusd) {
          return farm
        }

        const totalLiquidity = farm.isTokenOnly ? new BigNumber(farm.lpTotalInQuoteToken).times(farm.tokenPriceBusd ?? 0) : new BigNumber(farm.lpTotalInQuoteToken).times(farm.quoteTokenPriceBusd)
        const { cakeRewardsApr, lpRewardsApr } = isActive
          ? getFarmApr(
              chainId,
              new BigNumber(farm.poolWeight ?? 0),
              cakePrice,
              totalLiquidity,
              farm.lpAddress,
              regularCakePerBlock ?? 0,
            )
          : { cakeRewardsApr: 0, lpRewardsApr: 0 }

        return { ...farm, apr: cakeRewardsApr ?? undefined, lpRewardsApr, liquidity: totalLiquidity }
      })

      return filterFarmsByQuery(farmsToDisplayWithAPR, query)
    },
    [query, isActive, chainId, cakePrice, regularCakePerBlock],
  )

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  const [numberOfFarmsVisible, setNumberOfFarmsVisible] = useState(NUMBER_OF_FARMS_VISIBLE)

  const chosenFarms = useMemo(() => {
    let chosenFs: FarmWithStakedValue[] = []
    if (isActive) {
      chosenFs = stakedOnly ? farmsList(stakedOnlyFarms) : farmsList(activeFarms)
    }
    if (isInactive) {
      chosenFs = stakedOnly ? farmsList(stakedInactiveFarms) : farmsList(inactiveFarms)
    }
    if (isArchived) {
      chosenFs = stakedOnly ? farmsList(stakedArchivedFarms) : farmsList(archivedFarms)
    }

    return chosenFs
  }, [
    activeFarms,
    farmsList,
    inactiveFarms,
    archivedFarms,
    isActive,
    isInactive,
    isArchived,
    stakedArchivedFarms,
    stakedInactiveFarms,
    stakedOnly,
    stakedOnlyFarms,
  ])

  const chosenFarmsMemoized = useMemo(() => {
    const sortFarms = (farms: FarmWithStakedValue[]): FarmWithStakedValue[] => {
      switch (sortOption) {
        case 'apr':
          return orderBy(farms, (farm: FarmWithStakedValue) => Number(farm.apr) + Number(farm.lpRewardsApr), 'desc')
        case 'earned':
          return orderBy(
            farms,
            (farm: FarmWithStakedValue) => (farm.userData ? Number(farm.userData.earnings) : 0),
            'desc',
          )
        case 'liquidity':
          return orderBy(farms, (farm: FarmWithStakedValue) => Number(farm.liquidity), 'desc')
        default:
          return farms
      }
    }

    return sortFarms(chosenFarms).slice(0, numberOfFarmsVisible)
  }, [chosenFarms, sortOption, numberOfFarmsVisible])

  chosenFarmsLength.current = chosenFarmsMemoized.length

  useEffect(() => {
    if (isIntersecting) {
      setNumberOfFarmsVisible((farmsCurrentlyVisible) => {
        if (farmsCurrentlyVisible <= chosenFarmsLength.current) {
          return farmsCurrentlyVisible + NUMBER_OF_FARMS_VISIBLE
        }
        return farmsCurrentlyVisible
      })
    }
  }, [isIntersecting])

  const handleSortOptionChange = (option: OptionProps): void => {
    setSortOption(option.value)
  }

  const providerValue = useMemo(() => ({ chosenFarms: chosenFarmsMemoized }), [chosenFarmsMemoized])

  return (
    <FarmsContext.Provider value={providerValue}>
      <Page>
        <ControlContainer>
          <ViewControls>
            <FarmTabButtons hasStakeInFinishedFarms={stakedInactiveFarms.length > 0} />
            <Wrapper>
              <Flex width="max-content" flexDirection="column">
                <ButtonMenu activeIndex={stakedOnly ? 1 : 0} scale="sm" variant="primary" onItemClick={() => setStakedOnly(!stakedOnly)}>
                  <ButtonMenuItem>
                    All
                  </ButtonMenuItem>
                  <ButtonMenuItem>
                    My
                  </ButtonMenuItem>
                </ButtonMenu>
              </Flex>
            </Wrapper>
          </ViewControls>
          <FilterContainer>
            <LabelWrapper>
              <Select
                options={[
                  {
                    label: 'Hot',
                    value: 'hot',
                  },
                  {
                    label: 'APR',
                    value: 'apr',
                  },
                  {
                    label: 'Earned',
                    value: 'earned',
                  },
                  {
                    label: 'Liquidity',
                    value: 'liquidity',
                  },
                ]}
                onOptionChange={handleSortOptionChange}
              />
            </LabelWrapper>
            <LabelWrapper style={{ marginLeft: 16 }}>
              <SearchInput initialValue={normalizedUrlSearch} onChange={handleChangeQuery} placeholder="Search Farms" />
            </LabelWrapper>
          </FilterContainer>
        </ControlContainer>
        <Table farms={chosenFarmsMemoized} cakePrice={cakePrice} userDataReady={userDataReady} />
        {account && !userDataLoaded && stakedOnly && (
          <Flex justifyContent="center">
            <Loading />
          </Flex>
        )}
        {poolLength && <div ref={observerRef} />}
      </Page>
    </FarmsContext.Provider>
  )
}

export default Farms
