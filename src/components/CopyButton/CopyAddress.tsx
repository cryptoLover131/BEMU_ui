import styled from "styled-components";
import { CopyButton } from "./CopyButton";
import { Box, Flex, FlexProps } from "../Box";

interface CopyAddressProps extends FlexProps {
  account: string | undefined;
  tooltipMessage: string;
}

const Wrapper = styled(Flex)`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  position: relative;
`;

export const CopyAddress: React.FC<React.PropsWithChildren<CopyAddressProps>> = ({
  account,
  tooltipMessage,
  ...props
}) => {
  return (
    <Box position="relative" {...props}>
      <Wrapper>
        <Flex margin="12px">
          <CopyButton width="16px" text={account ?? ""} tooltipMessage={tooltipMessage} />
        </Flex>
      </Wrapper>
    </Box>
  );
};
