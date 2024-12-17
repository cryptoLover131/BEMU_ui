import React from "react";
import styled from "styled-components";
import Accordion from "./Accordion";
import { PanelProps, PushedProps } from "../types";
import MenuItem from "../../../components/MenuItem";

interface Props extends PanelProps, PushedProps {
  isMobile: boolean;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
`;

const PanelBody: React.FC<Props> = ({ isPushed, pushNav, links, activeItem, activeSubItem }) => {
  return (
    <Container>
      {links.map(({ label, items: menuItems = [], href, icon, disabled }) => {
        // const calloutClass = entry.calloutClass ? entry.calloutClass : undefined;
        const statusColor = menuItems?.find((menuItem) => menuItem.status !== undefined)?.status?.color;
        const isActive = href === activeItem;

        return (
          <Accordion
              key={href}
              isPushed={isPushed}
              pushNav={pushNav}
              icon={icon}
              label={label}
              href={href}
              isActive={isActive}
              hasSubItems={menuItems.length > 0}
            >
              {isPushed &&
                menuItems.map((item) => (
                    <MenuItem key={item.href} href={item.href} variant="subMenu" isActive={item.href === activeSubItem} statusColor={statusColor} isDisabled={disabled}>
                      {item.label}
                    </MenuItem>
                ))}
            </Accordion>
        );
      })}
    </Container>
  );
};

export default PanelBody;
