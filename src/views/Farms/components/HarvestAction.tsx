import { useToast } from 'contexts'
import BigNumber from 'bignumber.js'
import { ToastDescriptionWithTx } from 'components/Toast'
import { Balance, Button, Text } from 'components'
import { GTOKEN } from 'libraries/tokens'
import useCatchTxError from 'hooks/useCatchTxError'
import useBUSDPrice from 'hooks/useBUSDPrice'
import { useAppDispatch } from 'state'
import { fetchFarmUserDataAsync } from 'state/farms'
import { useCallback, useMemo } from 'react'
import { BIG_ZERO } from 'utils/bigNumber'
import { getBalanceAmount } from 'utils/formatBalance'
import { FarmWithStakedValue } from 'libraries/farms'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import useHarvestFarm from '../hooks/useHarvestFarm'
import { ActionContainer, ActionContent, ActionTitles } from "./styles";

interface HarvestActionProps extends FarmWithStakedValue {
  userDataReady: boolean
  onReward: () => Promise<any>
  onDone?: () => void
}

export const HarvestActionContainer = ({ children, ...props }) => {
  const { onReward } = useHarvestFarm(props.pid)
  const { account, chainId } = useAccountActiveChain()
  const dispatch = useAppDispatch()

  const onDone = useCallback(
    () => {
      if (account && chainId) {
        dispatch(fetchFarmUserDataAsync({ account, pids: [props.pid], chainId }))
      }
    },
    [account, dispatch, chainId, props.pid],
  )

  return children({ ...props, onDone, onReward })
}

export const HarvestAction: React.FunctionComponent<React.PropsWithChildren<HarvestActionProps>> = ({
  userData,
  userDataReady,
  onReward,
  onDone,
}) => {
  const { toastSuccess } = useToast()
  const { chainId } = useAccountActiveChain()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const earningsBigNumber = new BigNumber(userData?.earnings ?? 0)
  const price = useBUSDPrice(GTOKEN[chainId])
  const cakePrice = useMemo(() => (price? new BigNumber(price.toSignificant(6)) : BIG_ZERO), [price])
  let earnings = BIG_ZERO
  let earningsBusd = 0
  let displayBalance = earnings.toFixed(5, BigNumber.ROUND_DOWN)

  // If user didn't connect wallet default balance will be 0
  if (!earningsBigNumber.isZero()) {
    earnings = getBalanceAmount(earningsBigNumber)
    earningsBusd = earnings.multipliedBy(cakePrice).toNumber()
    displayBalance = earnings.toFixed(5, BigNumber.ROUND_DOWN)
  }

  const onClickHarvestButton = () => {
    handleHarvest()
  }

  const handleHarvest = async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return onReward()
    })
    if (receipt?.status) {
      toastSuccess(
        `Harvested!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          Your DKO earnings have been sent to your wallet!
        </ToastDescriptionWithTx>,
      )
      onDone?.()
    }
  }

  return (
    <ActionContainer>
      <ActionTitles>
        <Text textTransform="uppercase" color="secondary" fontSize="12px" pr="4px">
        DKO
        </Text>
        <Text textTransform="uppercase" color="textSubtle" fontSize="12px">
          Earned
        </Text>
      </ActionTitles>
      <ActionContent>
        <div>
          <Text>{displayBalance}</Text>
          {earningsBusd > 0 && (
            <Balance fontSize="12px" color="textSubtle" decimals={2} value={earningsBusd} unit=" USD" prefix="~" />
          )}
        </div>
        <Button 
          ml="4px" 
          disabled={earnings.eq(0) || pendingTx || !userDataReady} 
          onClick={onClickHarvestButton}
          height="36px"
          variant='secondary'
          width="130px"
        >
          {pendingTx ? "Harvesting" : "Harvest"}
        </Button>
      </ActionContent>
    </ActionContainer>
  )
}

export default HarvestAction
