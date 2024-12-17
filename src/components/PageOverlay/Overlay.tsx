import styled from "styled-components";
import { PageOverlayProps } from "./types";

const PageOverlay = styled.div.attrs({ role: "presentation" })<PageOverlayProps>`
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-color: #000000;
  transition: opacity 0.4s;
  opacity: ${({ show }) => (show ? 0.6 : 0)};
  z-index: ${({ zIndex }) => zIndex};
  pointer-events: ${({ show }) => (show ? "initial" : "none")};
`;

PageOverlay.defaultProps = {
  show: false,
  zIndex: 10,
};

export default PageOverlay;
