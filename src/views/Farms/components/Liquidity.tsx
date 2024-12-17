import styled from "styled-components";
import { Text } from "components/Text";
import { Skeleton } from "components/Skeleton";
import { FarmTableLiquidityProps } from "../types";

const LiquidityWrapper = styled.div`
  // min-width: 110px;
  font-weight: 600;
  text-align: right;
  margin-right: 14px;

  ${({ theme }) => theme.mediaQueries.lg} {
    text-align: left;
    margin-right: 0;
  }
`;

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const Liquidity: React.FunctionComponent<React.PropsWithChildren<FarmTableLiquidityProps>> = ({ liquidity }) => {
  const displayLiquidity =
    liquidity && liquidity.gt(0) ? (
      `$${Number(liquidity).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
    ) : (
      <Skeleton width={60} />
    );

  return (
    <Container>
      <LiquidityWrapper>
        <Text>{displayLiquidity}</Text>
      </LiquidityWrapper>
    </Container>
  );
};

export default Liquidity;
