import { Text } from "components/Text";
import { Button } from "components/Button";
import { StyledActionContainer, ActionContent, ActionTitles } from "./styles";

interface StakeComponentProps {
  lpSymbol: string;
  isStakeReady: boolean;
  onPresentDeposit: () => void;
}

const StakeComponent: React.FunctionComponent<React.PropsWithChildren<StakeComponentProps>> = ({
  lpSymbol,
  isStakeReady,
  onPresentDeposit,
}) => {

  return (
    <StyledActionContainer>
      <ActionTitles>
        <Text textTransform="uppercase" color="textSubtle" fontSize="12px" pr="4px">
          Stake
        </Text>
        <Text color="secondary" fontSize="12px">
          {lpSymbol}
        </Text>
      </ActionTitles>
      <ActionContent>
        <Button 
          width="100%" 
          onClick={onPresentDeposit} variant="secondary" 
          disabled={isStakeReady}
          height="36px"
        >
          Deposit
        </Button>
      </ActionContent>
    </StyledActionContainer>
  );
};

export default StakeComponent;
