import { Text } from "components/Text";
import { Skeleton } from "components/Skeleton";
import { StyledActionContainer, ActionContent, ActionTitles } from "./styles";

const StakeActionDataNotReady = () => {
  return (
    <StyledActionContainer>
      <ActionTitles>
        <Text textTransform="uppercase" color="textSubtle" fontSize="12px">
          Start Farming
        </Text>
      </ActionTitles>
      <ActionContent>
        <Skeleton width={180} />
      </ActionContent>
    </StyledActionContainer>
  );
};

export default StakeActionDataNotReady;
