import styled from "styled-components";
import { useTooltip, Placement } from "hooks";
import { Box, BoxProps } from "components/Box";

interface Props extends BoxProps {
  text: string | React.ReactNode;
  placement?: Placement;
}

const QuestionWrapper = styled.div`
  :hover,
  :focus {
    opacity: 0.7;
  }
`;

export const QuestionToolTip: React.FC<React.PropsWithChildren<Props>> = ({
  text,
  placement = "right-end",
  children,
  ...props
}) => {
  const { targetRef, tooltip, tooltipVisible } = useTooltip(text, { placement });

  return (
    <Box {...props} style={{cursor: "help"}}>
      {tooltipVisible && tooltip}
      <QuestionWrapper ref={targetRef}>
        {children}
      </QuestionWrapper>
    </Box>
  );
};
