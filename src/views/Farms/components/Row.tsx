import { createElement, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useMatchBreakpoints } from 'contexts'
import useDelayedUnmount from 'hooks/useDelayedUnmount'
import { useFarmUser } from 'state/farms/hooks'
import { 
  DesktopColumnSchema, 
  MobileColumnSchema,
  FarmTableEarnedProps,
  FarmTableLiquidityProps,
  FarmTableFarmTokenInfoProps,
  FarmTableFarmNameProps,
  FarmWithStakedValue
} from '../types'

import Apr, { AprProps } from './Apr'
import Farm from './Farm'

import CellLayout from './CellLayout'
import Liquidity from './Liquidity'
import Earned from './Earned'
import Name from './Name'
import TokenInfo from './TokenInfo'
import ActionPanel from './ActionPanel'

export interface RowProps {
  apr: AprProps
  farm: FarmTableFarmTokenInfoProps
  name: FarmTableFarmNameProps
  earned: FarmTableEarnedProps
  liquidity: FarmTableLiquidityProps
  details: FarmWithStakedValue
}

interface RowPropsWithLoading extends RowProps {
  userDataReady: boolean
}

const cells = {
  apr: Apr,
  farm: TokenInfo,
  name: Name,
  earned: Earned,
  liquidity: Liquidity,
}

const CellInner = styled.div`
  padding: 12px 0px;
  display: flex;
  align-items: center;
  padding-right: 8px;

  ${({ theme }) => theme.mediaQueries.xl} {
    padding-right: 32px;
  }
`

const StyledTr = styled.tr`
  cursor: pointer;
  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  }
`

const EarnedMobileCell = styled.td`
  padding: 16px 0 24px 16px;
`

const AprMobileCell = styled.td`
  padding-top: 16px;
  padding-bottom: 24px;
`

const FarmMobileCell = styled.td`
  padding-top: 24px;
`

const Row: React.FunctionComponent<React.PropsWithChildren<RowPropsWithLoading>> = (props) => {
  const { userDataReady, details } = props
  const hasStakedAmount = !!useFarmUser(details.pid).stakedBalance.toNumber()
  const [actionPanelExpanded, setActionPanelExpanded] = useState(hasStakedAmount)
  const shouldRenderChild = useDelayedUnmount(actionPanelExpanded, 300)

  const toggleActionPanel = () => {
    setActionPanelExpanded(!actionPanelExpanded)
  }

  useEffect(() => {
    setActionPanelExpanded(hasStakedAmount)
  }, [hasStakedAmount])

  const { isDesktop, isMobile } = useMatchBreakpoints()

  const isSmallerScreen = !isDesktop
  const tableSchema = isSmallerScreen ? MobileColumnSchema : DesktopColumnSchema
  const columnNames = tableSchema.map((column) => column.name)

  const handleRenderRow = () => {
    if (!isMobile) {
      return (
        <StyledTr onClick={toggleActionPanel}>
          {Object.keys(props).map((key) => {
            const columnIndex = columnNames.indexOf(key)
            if (columnIndex === -1) {
              return null
            }

            switch (key) {
              case 'apr':
                return (
                  <td key={key}>
                    <CellInner>
                      <CellLayout label='APR'>
                        <Apr
                          {...props.apr}
                          hideButton={isSmallerScreen}
                        />
                      </CellLayout>
                    </CellInner>
                  </td>
                )
              case 'details':
                return <td key={key} />
              default:
                return (
                  <td key={key}>
                    <CellInner>
                      <CellLayout label={tableSchema[columnIndex].label}>
                        {createElement(cells[key], { ...props[key], userDataReady })}
                      </CellLayout>
                    </CellInner>
                  </td>
                )
            }
          })}
        </StyledTr>
      )
    }

    return (
      <>
        <tr style={{ cursor: 'pointer', width: "100%" }} onClick={toggleActionPanel}>
          <FarmMobileCell colSpan={3}>
            <Farm {...props.farm} />
          </FarmMobileCell>
        </tr>
        <StyledTr onClick={toggleActionPanel}>
          <EarnedMobileCell width="50%">
            <CellLayout label='Total Staked'>
              <Liquidity {...props.liquidity} />
            </CellLayout>
          </EarnedMobileCell>
          <AprMobileCell width="50%">
            <CellLayout label='APR'>
              <Apr
                {...props.apr}
                hideButton
              />
            </CellLayout>
          </AprMobileCell>
        </StyledTr>
      </>
    )
  }

  return (
    <>
      {handleRenderRow()}
      {shouldRenderChild && (
        <tr>
          <td colSpan={7} key={`farm-actionpanel-${details.pid}`}>
            <ActionPanel {...props} expanded={actionPanelExpanded} />
          </td>
        </tr>
      )}
    </>
  )
}

export default Row
