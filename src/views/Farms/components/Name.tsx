import styled from "styled-components";
import { getBalanceNumber } from "utils/formatBalance";
import { Flex } from "components";
import { Text } from "components/Text";
import { Skeleton } from "components/Skeleton";
import { FarmTableFarmTokenInfoProps } from "../types";

const Container = styled.div`
  display: flex;
`;

const Name: React.FunctionComponent<React.PropsWithChildren<FarmTableFarmTokenInfoProps>> = ({
  label,
  isReady,
  stakedBalance,
  isTokenOnly
}) => {
  const rawStakedBalance = stakedBalance ? getBalanceNumber(stakedBalance) : 0;

  const handleRenderFarming = (): JSX.Element => {
    if (rawStakedBalance) {
      return (
        <Text color="secondary" fontSize="12px" textTransform="uppercase">
          {isTokenOnly ? "Staking": "Farming"}
        </Text>
      );
    }
    return <></>;
  };

  if (!isReady) {
    return (
      <Container>
        <div>
          <Skeleton width={40} height={10} mb="4px" />
        </div>
      </Container>
    );
  }

  const pairContainer = (
    <Container>
      <Flex alignItems="center">
        {handleRenderFarming()}
        <Text>{label}</Text>
      </Flex>
    </Container>
  );

  return pairContainer
};

export default Name;
