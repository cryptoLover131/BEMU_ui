import styled, { keyframes, DefaultTheme } from "styled-components";
import { MENU_HEIGHT } from "../config";

export interface Props {
  secondary?: boolean;
  isActive?: boolean;
  theme: DefaultTheme;
}

export interface LabelProps {
  isActive?: boolean;
}

const rainbowAnimation = keyframes`
  0%,
  100% {
    background-position: 0 0;
  }
  50% {
    background-position: 100% 0;
  }
`;

const LinkLabel = styled.div<LabelProps>`
  color: ${({ theme, isActive }) => (isActive ? theme.colors.primary : theme.colors.text)};
  transition: color 0.4s;
  flex-grow: 1;
`;

const MenuEntry = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  height: ${MENU_HEIGHT}px;
  padding: 0 16px;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textSubtle};

  a {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
  }

  // Safari fix
  flex-shrink: 0;

  &.rainbow {
    background-clip: text;
    animation: ${rainbowAnimation} 3s ease-in-out infinite;
    background: ${({ theme }) => theme.colors.gradientBubblegum};
    background-size: 400% 100%;
  }
`;
MenuEntry.defaultProps = {
  role: "button",
};

export { MenuEntry, LinkLabel };
