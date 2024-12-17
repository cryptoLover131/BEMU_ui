import React, { ReactNode, createElement, useContext, useState } from "react";
import styled from "styled-components";
import { Box, ArrowDropDownIcon, ArrowDropUpIcon, OpenNewIcon } from "components";
import { MENU_HEIGHT } from "../config";
import { LinkLabel, MenuEntry } from "./MenuEntry";
import { PushedProps } from "../types";
import { MenuContext } from "../context";

interface Props extends PushedProps {
  label: string;
  href: string;
  icon: React.ElementType | undefined;
  initialOpenState?: boolean;
  children: ReactNode;
  isActive?: boolean;
  hasSubItems: boolean;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  // Safari fix
  flex-shrink: 0;
`;

const AccordionContent = styled.div<{ isOpen: boolean; isPushed: boolean; maxHeight: number }>`
  max-height: ${({ isOpen, maxHeight }) => (isOpen ? `${maxHeight}px` : 0)};
  transition: max-height 0.3s ease-out;
  overflow: hidden;
  border-width: 1px 0;
`;

const Accordion: React.FC<Props> = ({
  label,
  href,
  icon,
  isPushed,
  pushNav,
  children,
  isActive,
  hasSubItems,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    if (isPushed) {
      setIsOpen((prevState) => !prevState);
    } else {
      pushNav(true);
      setIsOpen(true);
    }
  };

  let iconWidth = "20px"
  let mRight = "20px"

  switch (href) {
    case '/earn':
      iconWidth = "16px"
      mRight = "24px"
      break
    case '/multisend':
      iconWidth = "16px"
      mRight = "24px"
      break
    case '/token':
      iconWidth = "16px"
      mRight = "24px"
      break
    case '/launchpad':
      iconWidth = "16px"
      mRight = "24px"
      break
    default:
      iconWidth = "20px"
      mRight = "20px"
      break
  }

  const { linkComponent } = useContext(MenuContext);

  return (
    <Container>
      <MenuEntry onClick={handleClick} as={linkComponent} href={href}>
        <Box marginRight={mRight}>
          {(icon && createElement(icon as any, { color: isActive ? "primary" : "text", width: iconWidth }))}
        </Box>
        <LinkLabel isActive={isActive}>{label}</LinkLabel>
        {hasSubItems && (isOpen ? <ArrowDropUpIcon color={isActive ? "primary" : "text"} /> : <ArrowDropDownIcon color={isActive ? "primary" : "text"} />)}
        {href === "/bridge" && <Box display="flex" style={{ alignItems: "center" }} ml="4px">
          <OpenNewIcon color="text" width="16px" />
        </Box>}
      </MenuEntry>
      <AccordionContent
        isOpen={isOpen}
        isPushed={isPushed}
        maxHeight={React.Children.count(children) * MENU_HEIGHT}
      >
        {children}
      </AccordionContent>
    </Container>
  );
};

export default Accordion;
