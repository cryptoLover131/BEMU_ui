import styled, { css, DefaultTheme } from "styled-components";
import { space } from "styled-system";
import { promotedGradient } from "utils/animationToolkit";
import { Box } from "../Box";
import { CardProps } from "./types";

interface StyledCardProps extends CardProps {
  theme: DefaultTheme;
}

export const StyledCard = styled.div<StyledCardProps>`
  background: ${({ theme}) => theme.colors.gradientBubblegum};
  border-radius: ${({ theme }) => theme.radii.card};
  color: ${({ theme, isDisabled }) => theme.colors[isDisabled ? "textDisabled" : "text"]};
  overflow: hidden;
  position: relative;

  ${({ isActive }) =>
    isActive &&
    css`
      animation: ${promotedGradient} 3s ease infinite;
      background-size: 400% 400%;
    `}

  padding: 1px 1px 3px 1px;

  ${space}
`;

export const StyledCardInner = styled(Box)<{ background?: string; hasCustomBorder: boolean }>`
  width: 100%;
  height: 100%;
  overflow: ${({ hasCustomBorder }) => (hasCustomBorder ? "initial" : "inherit")};
  // background: ${({ theme, background }) => background ?? theme.colors.gradientBubblegum};
  border-radius: ${({ theme }) => theme.radii.card};
`;

StyledCard.defaultProps = {
  isActive: false,
  isSuccess: false,
  isWarning: false,
  isDisabled: false,
};
