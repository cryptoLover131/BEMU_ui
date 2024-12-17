import BigNumber from "bignumber.js";
import { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import _toNumber from "lodash/toNumber";
import { getFullDisplayBalance, formatNumber, getDecimalAmount } from "utils/formatBalance";
import { getInterestBreakdown } from "utils/compoundApyHelpers";
import { BIG_ZERO } from "utils/bigNumber";
import { trimTrailZero } from "utils/trimTrailZero";
import { Modal, ModalV2, ModalBody, ModalActions, ModalInput } from "widgets/Modal";
import { Flex } from "components/Box";
import { Text } from "components/Text";
import { Button, IconButton } from "components/Button";
import { LinkExternal } from "components/Link";
import { AutoRenewIcon, CalculateIcon } from "components/Svg";
import { RoiCalculatorModal } from "components/RoiCalculatorModal";

const AnnualRoiContainer = styled((props: any) => <Flex {...props} />)`
  cursor: pointer;
`;

const AnnualRoiDisplay = styled((props: any) => <Text {...props} />)`
  width: 72px;
  max-width: 72px;
  overflow: hidden;
  text-align: right;
  text-overflow: ellipsis;
`;

interface DepositModalProps {
  account?: `0x${string}`;
  pid: number;
  max: BigNumber;
  stakedBalance: BigNumber;
  multiplier?: string;
  lpPrice?: BigNumber;
  lpLabel?: string;
  tokenName?: string;
  apr?: number;
  displayApr?: string;
  addLiquidityUrl?: string;
  cakePrice?: BigNumber;
  isTokenOnly?: boolean;
  lpTotalSupply: BigNumber;
  decimals: number;
  allowance?: BigNumber;
  enablePendingTx?: boolean;
  onDismiss?: () => void;
  onConfirm: (amount: string) => void;
  handleApprove: (amount: bigint) => void;
}

const DepositModal: React.FC<React.PropsWithChildren<DepositModalProps>> = ({
  account,
  max,
  stakedBalance,
  tokenName = "",
  multiplier,
  displayApr,
  lpPrice = BIG_ZERO,
  lpLabel = "",
  apr = 0,
  addLiquidityUrl = "",
  cakePrice = BIG_ZERO,
  decimals,
  allowance,
  enablePendingTx,
  onConfirm,
  onDismiss,
  handleApprove,
  isTokenOnly
}) => {
  const [val, setVal] = useState("");
  const [valUSDPrice, setValUSDPrice] = useState(BIG_ZERO);
  const [pendingTx, setPendingTx] = useState(false);
  const [showRoiCalculator, setShowRoiCalculator] = useState(false);
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max, decimals);
  }, [max, decimals]);

  const needEnable = useMemo(() => {
    if (allowance) {
      const amount = getDecimalAmount(new BigNumber(val), decimals);
      return amount.gt(allowance);
    }
    return false;
  }, [allowance, decimals, val]);

  const lpTokensToStake = new BigNumber(val);
  const fullBalanceNumber = useMemo(() => new BigNumber(fullBalance), [fullBalance]);

  const usdToStake = lpTokensToStake.times(lpPrice);

  const interestBreakdown = getInterestBreakdown({
    principalInUSD: !lpTokensToStake.isNaN() ? usdToStake.toNumber() : 0,
    apr,
    earningTokenPrice: cakePrice.toNumber(),
  });

  const annualRoi = cakePrice.times(interestBreakdown[3]);
  const annualRoiAsNumber = annualRoi.toNumber();
  const formattedAnnualRoi = formatNumber(annualRoiAsNumber, annualRoi.gt(10000) ? 0 : 2, annualRoi.gt(10000) ? 0 : 2);

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      if (e.currentTarget.validity.valid) {
        const inputVal = e.currentTarget.value.replace(/,/g, ".");
        setVal(inputVal);

        const USDPrice = inputVal === "" ? BIG_ZERO : new BigNumber(inputVal).times(lpPrice);
        setValUSDPrice(USDPrice);
      }
    },
    [setVal, setValUSDPrice, lpPrice]
  );

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance);

    const USDPrice = new BigNumber(fullBalance).times(lpPrice);
    setValUSDPrice(USDPrice);
  }, [fullBalance, setVal, setValUSDPrice, lpPrice]);

  const handlePercentInput = useCallback(
    (percent: number) => {
      const totalAmount = fullBalanceNumber.dividedBy(100).multipliedBy(percent);
      const amount = trimTrailZero(totalAmount.toNumber().toFixed(decimals));
      setVal(amount as string);

      const USDPrice = totalAmount.times(lpPrice);
      setValUSDPrice(USDPrice);
    },
    [fullBalanceNumber, decimals, lpPrice]
  );

  if (showRoiCalculator) {
    return (
      <ModalV2 isOpen={showRoiCalculator}>
        <RoiCalculatorModal
          account={account}
          linkLabel={`Get ${lpLabel}`}
          stakingTokenBalance={stakedBalance.plus(max)}
          stakingTokenDecimals={decimals}
          stakingTokenSymbol={tokenName}
          stakingTokenPrice={lpPrice.toNumber()}
          earningTokenPrice={cakePrice.toNumber()}
          apr={apr}
          multiplier={multiplier}
          displayApr={displayApr}
          linkHref={addLiquidityUrl}
          isFarm
          initialValue={val}
          onBack={() => setShowRoiCalculator(false)}
        />
      </ModalV2>
    );
  }

  return (
    <Modal title={isTokenOnly ? `Stake ${tokenName}` : `Stake ${tokenName}`} onDismiss={onDismiss}>
      <ModalBody width={["100%", "100%", "100%", "420px"]}>
        <ModalInput
          value={val}
          valueUSDPrice={valUSDPrice}
          onSelectMax={handleSelectMax}
          onPercentInput={handlePercentInput}
          onChange={handleChange}
          max={fullBalance}
          maxAmount={fullBalanceNumber}
          symbol={tokenName}
          addLiquidityUrl={addLiquidityUrl}
          inputTitle="Stake"
          decimals={decimals}
          needEnable={needEnable}
        />
        <Flex mt="24px" alignItems="center" justifyContent="space-between">
          <Text mr="8px" color="textSubtle">
            Annual ROI at current rates:
          </Text>
          <AnnualRoiContainer
              alignItems="center"
              onClick={() => {
                setShowRoiCalculator(true);
              }}
            >
              <AnnualRoiDisplay>${formattedAnnualRoi}</AnnualRoiDisplay>
              <IconButton variant="text" scale="sm">
                <CalculateIcon color="textSubtle" width="18px" />
              </IconButton>
            </AnnualRoiContainer>
        </Flex>
        <ModalActions>
          <Button 
            variant="secondary" 
            onClick={onDismiss} 
            width="100%" 
            height="48px"
            disabled={pendingTx}
          >
            Cancel
          </Button>
          {needEnable ? (
            <Button
              width="100%"
              isLoading={enablePendingTx}
              endIcon={enablePendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
              height="48px"
              onClick={() => handleApprove(BigInt(new BigNumber(val).times(10**decimals).toString()))}
              variant="primary"
            >
              Enable
            </Button>
          ) : pendingTx ? (
            <Button 
              width="100%" 
              height="48px"
              isLoading={pendingTx} 
              endIcon={<AutoRenewIcon spin color="currentColor" />}
              variant="primary"
            >
              Confirming
            </Button>
          ) : (
            <Button
              width="100%"
              height="48px"
              variant="primary"
              disabled={!lpTokensToStake.isFinite() || lpTokensToStake.eq(0) || lpTokensToStake.gt(fullBalanceNumber)}
              onClick={async () => {
                setPendingTx(true);
                await onConfirm(val);
                onDismiss?.();
                setPendingTx(false);
              }}
            >
              Confirm
            </Button>
          )}
        </ModalActions>
        <LinkExternal href={addLiquidityUrl} style={{ alignSelf: "center" }}>
          <Text fontSize="14px">
            Get {tokenName}
          </Text>
        </LinkExternal>
      </ModalBody>
    </Modal>
  );
};

export default DepositModal;
