import styled from 'styled-components'
import { Text, RoiCalculatorModal, Flex } from 'components'
import { useModal } from 'widgets/Modal'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'
import _toNumber from 'lodash/toNumber'
import { useAccount } from 'wagmi'
import { useFarmUser } from 'state/farms/hooks'

const ApyLabelContainer = styled(Flex)`
  cursor: pointer;
  &:hover {
    opacity: 0.5;
  }
  width: 100px;
`;

export interface ApyButtonProps {
  variant: 'text' | 'text-and-button'
  pid: number
  lpSymbol: string
  lpTokenPrice: BigNumber
  lpLabel?: string
  multiplier: string
  cakePrice?: BigNumber
  apr?: number
  displayApr?: string
  lpRewardsApr?: number
  addLiquidityUrl?: string
  strikethrough?: boolean
  useTooltipText?: boolean
  hideButton?: boolean
  isTokenOnly: boolean
}

const ApyButton: React.FC<React.PropsWithChildren<ApyButtonProps>> = ({
  pid,
  lpLabel,
  lpTokenPrice,
  lpSymbol,
  cakePrice,
  apr,
  multiplier,
  displayApr,
  addLiquidityUrl,
  strikethrough,
  isTokenOnly,
}) => {
  const { address: account } = useAccount()
  const { tokenBalance, stakedBalance } = useFarmUser(pid)

  const userBalanceInFarm = new BigNumber(stakedBalance).plus(tokenBalance).gt(0)
    ? new BigNumber(stakedBalance).plus(tokenBalance)
    : BIG_ZERO
  const [onPresentApyModal] = useModal(
    <RoiCalculatorModal
      account={account}
      pid={pid}
      linkLabel={`Get ${lpLabel ?? "unknown"}`}
      stakingTokenBalance={userBalanceInFarm}
      stakingTokenDecimals={18}
      stakingTokenSymbol={lpSymbol}
      stakingTokenPrice={lpTokenPrice.toNumber()}
      earningTokenPrice={cakePrice?.toNumber() ?? 0}
      apr={apr}
      multiplier={multiplier}
      displayApr={displayApr}
      linkHref={addLiquidityUrl}
      isFarm={!isTokenOnly}
    />,
    true,
    true,
    `FarmModal${pid}`,
  )

  const handleClickButton = (event): void => {
    event.stopPropagation()
    onPresentApyModal()
  }

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    handleClickButton(event);
  };

  return (
    <Flex flexDirection="column" alignItems="flex-start">
      <ApyLabelContainer
        alignItems="center"
        style={{ textDecoration: strikethrough ? "line-through" : "initial" }}
        onClick={handleClick}
      >
        <Text>{displayApr}%</Text>
      </ApyLabelContainer>
    </Flex>
  )
}

export default ApyButton
