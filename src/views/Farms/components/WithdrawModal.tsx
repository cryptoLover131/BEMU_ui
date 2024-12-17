import BigNumber from "bignumber.js";
import { useCallback, useMemo, useState } from "react";
import { getFullDisplayBalance } from "utils/formatBalance";
import { trimTrailZero } from "utils/trimTrailZero";
import { BIG_ZERO } from "utils/bigNumber";
import { Button } from "components/Button";
import { AutoRenewIcon } from "components/Svg";
import { Modal, ModalBody, ModalActions, ModalInput } from "widgets/Modal";

interface WithdrawModalProps {
  max: BigNumber;
  lpPrice?: BigNumber;
  onConfirm: (amount: string) => void;
  onDismiss?: () => void;
  tokenName?: string;
  decimals: number;
  isTokenOnly?: boolean;
}

const WithdrawModal: React.FC<React.PropsWithChildren<WithdrawModalProps>> = ({
  onConfirm,
  onDismiss,
  max,
  lpPrice = BIG_ZERO,
  tokenName = "",
  decimals,
  isTokenOnly,
}) => {
  const [val, setVal] = useState("");
  const [valUSDPrice, setValUSDPrice] = useState(BIG_ZERO);
  const [pendingTx, setPendingTx] = useState(false);
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max, decimals);
  }, [max, decimals]);

  const valNumber = new BigNumber(val);
  const fullBalanceNumber = useMemo(() => new BigNumber(fullBalance), [fullBalance]);

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

  return (
    <Modal title={isTokenOnly ? 'Unstake DKO' : `Unstake ${tokenName}`} onDismiss={onDismiss}>
      <ModalBody width={["100%", "100%", "100%", "420px"]}>
        <ModalInput
          onSelectMax={handleSelectMax}
          onPercentInput={handlePercentInput}
          onChange={handleChange}
          value={val}
          valueUSDPrice={valUSDPrice}
          max={fullBalance}
          maxAmount={fullBalanceNumber}
          symbol={tokenName}
          inputTitle="Unstake"
          decimals={decimals}
        />
        {/* {showCrossChainFarmWarning && (
          <Box mt="15px">
            <Message variant="warning">
              <MessageText>
                {t("For safety, cross-chain transactions will take around 30 minutes to confirm.")}
              </MessageText>
            </Message>
          </Box>
        )} */}
        <ModalActions>
          <Button 
            variant="secondary" 
            onClick={onDismiss} 
            width="100%" 
            height="36px"
            disabled={pendingTx}
          >
            Cancel
          </Button>
          {pendingTx ? (
            <Button 
              width="100%" 
              height="36px"
              isLoading={pendingTx} 
              endIcon={<AutoRenewIcon spin color="currentColor" />}
              variant="primary"
            >
              Confirming
            </Button>
          ) : (
            <Button
              width="100%"
              height="36px"
              disabled={!valNumber.isFinite() || valNumber.eq(0) || valNumber.gt(fullBalanceNumber)}
              onClick={async () => {
                setPendingTx(true);
                await onConfirm(val);
                onDismiss?.();
                setPendingTx(false);
              }}
              variant="primary"
            >
              Confirm
            </Button>
          )}
        </ModalActions>
      </ModalBody>
    </Modal>
  );
};

export default WithdrawModal;
