import styled from "styled-components";
import { useTooltip, Placement } from "hooks";
import { Box, BoxProps } from "components/Box";
import { HelpIcon } from "../Svg";

interface Props extends BoxProps {
  text: string | React.ReactNode;
  placement?: Placement;
  size?: string;
}

const QuestionWrapper = styled.div`
  :hover,
  :focus {
    opacity: 0.7;
  }
`;

export const QuestionHelper: React.FC<React.PropsWithChildren<Props>> = ({
  text,
  placement = "right-end",
  size = "16px",
  ...props
}) => {
  const { targetRef, tooltip, tooltipVisible } = useTooltip(text, { placement });

  return (
    <Box {...props}>
      {tooltipVisible && tooltip}
      <QuestionWrapper ref={targetRef}>
        <HelpIcon color="textSubtle" width={size} />
      </QuestionWrapper>
    </Box>
  );
};
