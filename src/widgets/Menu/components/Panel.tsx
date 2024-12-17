import React from "react";
import styled from "styled-components";
import PanelBody from "./PanelBody";
import PanelFooter from "./PanelFooter";
import { SIDEBAR_WIDTH_REDUCED, SIDEBAR_WIDTH_FULL } from "../config";
import { PanelProps, PushedProps } from "../types";

interface Props extends PanelProps, PushedProps {
  showMenu: boolean;
  isMobile: boolean;
  chainId: number;
}

const StyledPanel = styled.div<{ isPushed: boolean; showMenu: boolean; isMobile: boolean; }>`
  position: fixed;
  top: ${({ showMenu }) => (showMenu ? "75px" : "25px")};
  left: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-shrink: 0;
  padding-top: 10px;
  background: ${({ theme }) => theme.colors.gradientBubblegum};
  border-radius: 12px;
  width: ${({ isPushed }) => (isPushed ? `${SIDEBAR_WIDTH_FULL}px` : 0)};
  height: ${({ showMenu, isMobile }) => {
    return showMenu ? 
      (isMobile ? `calc(100vh - 150px)` : `calc(100vh - 100px)`)
        : 
        (isMobile ? `calc(100vh - 100px)` : `calc(100vh - 50px)`)
  }};
  transition: padding-top 0.2s, width 0.2s;
  border-right: ${({ isPushed }) => (isPushed ? "2px solid rgba(133, 133, 133, 0.1)" : 0)};
  z-index: 11;
  overflow: ${({ isPushed }) => (isPushed ? "initial" : "hidden")};
  transform: translate3d(0, 0, 0);

  ${({ theme }) => theme.mediaQueries.lg} {
    border-right: 2px solid rgba(133, 133, 133, 0.1);
    width: ${({ isPushed }) => `${isPushed ? SIDEBAR_WIDTH_FULL : SIDEBAR_WIDTH_REDUCED}px`};
  }
`;

const Panel: React.FC<Props> = (props) => {
  const { isPushed, showMenu, pushNav, isMobile } = props;
  return (
    <StyledPanel isPushed={isPushed} showMenu={showMenu} isMobile={isMobile} onClick={() => pushNav(true)}>
      <PanelBody {...props} />
      <PanelFooter {...props} />
    </StyledPanel>
  );
};

export default Panel;
