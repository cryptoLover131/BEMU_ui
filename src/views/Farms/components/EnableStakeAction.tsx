import { Text } from "components/Text";
import { Button } from "components/Button";
import { StyledActionContainer, ActionContent, ActionTitles } from "./styles";

interface EnableStakeActionProps {
  pendingTx: boolean;
  handleApprove: () => void;
}

const EnableStakeAction: React.FunctionComponent<React.PropsWithChildren<EnableStakeActionProps>> = ({
  pendingTx,
  handleApprove,
}) => {

  return (
    <StyledActionContainer>
      <ActionTitles>
        <Text textTransform="uppercase" color="textSubtle" fontSize="12px">
          Enable
        </Text>
      </ActionTitles>
      <ActionContent>
        <Button width="100%" disabled={pendingTx} onClick={handleApprove} variant="secondary">
          Enable
        </Button>
      </ActionContent>
    </StyledActionContainer>
  );
};

export default EnableStakeAction;
