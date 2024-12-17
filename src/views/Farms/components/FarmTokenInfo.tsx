import styled from "styled-components";
import { Flex } from "components";
import { Text } from "components/Text";
import { Skeleton } from "components/Skeleton";
import { FarmTableFarmTokenInfoProps } from "../types";

const Container = styled.div`
  padding-left: 16px;
  display: flex;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-left: 32px;
  }
`;

const TokenWrapper = styled.div`
  padding-right: 8px;
  width: 120px;
`;

const FarmTokenInfo: React.FunctionComponent<React.PropsWithChildren<FarmTableFarmTokenInfoProps>> = ({
  label,
  isReady,
  children,
}) => {
  if (!isReady) {
    return (
      <Container>
        <Skeleton mr="8px" width={32} height={32} variant="circle" />
        <div>
          <Skeleton width={40} height={10} mb="4px" />
          <Skeleton width={60} height={24} />
        </div>
      </Container>
    );
  }

  const pairContainer = (
    <Container>
      <TokenWrapper>{children}</TokenWrapper>
      <Flex alignItems="center">
        <Text>{label}</Text>
      </Flex>
    </Container>
  );

  return pairContainer
};

export default FarmTokenInfo;
