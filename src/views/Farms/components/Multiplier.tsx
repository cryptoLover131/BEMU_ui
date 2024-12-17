import styled from "styled-components";
import { Text } from "components/Text";
import { HelpIcon } from "components/Svg";
import { Skeleton } from "components/Skeleton";
import { useTooltip } from "hooks/useTooltip";
import { FarmTableMultiplierProps } from "../types";

const ReferenceElement = styled.div`
  display: inline-block;
`;

const MultiplierWrapper = styled.div`
  color: ${({ theme }) => theme.colors.text};
  width: 36px;
  text-align: right;
  margin-right: 14px;

  ${({ theme }) => theme.mediaQueries.lg} {
    text-align: left;
    // margin-right: 0;
  }
`;

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const Multiplier: React.FunctionComponent<React.PropsWithChildren<FarmTableMultiplierProps>> = ({
  multiplier,
  rewardCakePerSecond,
  isTokenOnly,
}) => {
  const displayMultiplier = multiplier ? multiplier.toLowerCase() : <Skeleton width={30} />;
  const tooltipContent = (
    <>
      {rewardCakePerSecond ? (
        <>
          <Text small>
            {isTokenOnly ? 
              "The Multiplier represents the proportion of DKO rewards each pool receives, as a proportion of the DKO produced each second."
             : 
              "The Multiplier represents the proportion of DKO rewards each farm receives, as a proportion of the DKO produced each second."
            }
          </Text>
          <Text my="24px" small>
            {" "}
            {isTokenOnly ? "For example, if a 1x pool received 1 DKO per second, a 40x pool would receive 40 DKO per second."
             : "For example, if a 1x farm received 1 DKO per second, a 40x farm would receive 40 DKO per second."}
          </Text>
          <Text small>{isTokenOnly ? "This amount is already included in all APR calculations for the pool." : 
          "This amount is already included in all APR calculations for the farm."}</Text>
        </>
      ) : (
        <>
          <Text small>
            {isTokenOnly ? 
              "The Multiplier represents the proportion of DKO rewards each pool receives, as a proportion of the DKO produced each block."
            :
              "The Multiplier represents the proportion of DKO rewards each farm receives, as a proportion of the DKO produced each block."
            }
          </Text>
          <Text my="24px" small>
            {" "}
            {isTokenOnly ? "For example, if a 1x pool received 1 DKO per block, a 40x pool would receive 40 DKO per block.":
            "For example, if a 1x pool received 1 DKO per block, a 40x pool would receive 40 DKO per block."}
          </Text>
        </>
      )}
    </>
  );
  const { targetRef, tooltip, tooltipVisible } = useTooltip(tooltipContent, {
    placement: "top-end",
    tooltipOffset: [20, 10],
  });

  return (
    <Container>
      <MultiplierWrapper>{displayMultiplier}</MultiplierWrapper>
      <ReferenceElement ref={targetRef}>
        <HelpIcon color="textSubtle" />
      </ReferenceElement>
      {tooltipVisible && tooltip}
    </Container>
  );
};

export default Multiplier;
