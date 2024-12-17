import { Text } from "components/Text";
import { ActionContent, ActionTitles, StyledActionContainer } from "./styles";

const AccountNotConnect = ({ children }: { children: React.ReactNode }) => {

  return (
    <StyledActionContainer>
      <ActionTitles>
        <Text textTransform="uppercase" color="textSubtle" fontSize="12px">
          Start Earning
        </Text>
      </ActionTitles>
      <ActionContent>{children}</ActionContent>
    </StyledActionContainer>
  );
};

export default AccountNotConnect;
