import { ReactNode } from "react";
import { Text } from "components/Text";
import { IconButton } from "components/Button";
import { MinusIcon, AddIcon } from "components/Svg";
import { StyledActionContainer, ActionContent, ActionTitles, IconButtonWrapper } from "./styles";

interface StakedActionComponentProps {
  lpSymbol: string;
  children?: ReactNode;
  disabledMinusButton?: boolean;
  disabledPlusButton?: boolean;
  onPresentWithdraw: () => void;
  onPresentDeposit: () => void;
}

const StakedActionComponent: React.FunctionComponent<React.PropsWithChildren<StakedActionComponentProps>> = ({
  lpSymbol,
  children,
  disabledMinusButton,
  disabledPlusButton,
  onPresentWithdraw,
  onPresentDeposit,
}) => {

  return (
    <StyledActionContainer>
      <ActionTitles>
        <Text color="secondary" fontSize="12px" pr="4px">
          {lpSymbol}
        </Text>
        <Text textTransform="uppercase" color="textSubtle" fontSize="12px">
          Staked
        </Text>
      </ActionTitles>
      <ActionContent>
        {children}
        <IconButtonWrapper>
          <IconButton 
            mr="6px" 
            variant="secondary" 
            disabled={disabledMinusButton} 
            onClick={onPresentWithdraw}
            height="36px"
          >
            <MinusIcon color="primary" width="14px" />
          </IconButton>
          <IconButton 
            variant="secondary" 
            disabled={disabledPlusButton} 
            onClick={onPresentDeposit}
            height="36px"
          >
            <AddIcon color="primary" width="14px" />
          </IconButton>
        </IconButtonWrapper>
      </ActionContent>
    </StyledActionContainer>
  );
};

export default StakedActionComponent;
