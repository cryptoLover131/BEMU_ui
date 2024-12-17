/* eslint-disable @typescript-eslint/no-explicit-any */
import { createElement, memo } from "react";
import isTouchDevice from "utils/isTouchDevice";
import { Flex } from "../Box";
import DropdownMenu from "../DropdownMenu/DropdownMenu";
import TopMenuItem from "../MenuItem/TopMenuItem";
import { MenuItemsProps } from "./types";

const TopMenuItems: React.FC<React.PropsWithChildren<MenuItemsProps>> = ({
  items = [],
  activeItem,
  activeSubItem,
  ...props
}) => {
  return (
    <Flex {...props}>
      {items.map(({ label, items: menuItems = [], href, icon, disabled }) => {
        const statusColor = menuItems?.find((menuItem) => menuItem.status !== undefined)?.status?.color;
        const isActive = activeItem === href;
        const linkProps = isTouchDevice() && menuItems && menuItems.length > 0 ? {} : { href };
        const Icon = icon;
        const hasSubItem = menuItems?.length > 0;
        return (
          <DropdownMenu
            key={`${label}#${href}`}
            items={menuItems}
            py={1}
            activeItem={activeSubItem}
            isDisabled={disabled}
          >
            <TopMenuItem {...linkProps} hasSubItem={hasSubItem} isActive={isActive} statusColor={statusColor} isDisabled={disabled}>
              {label || (icon && createElement(Icon as any, { color: isActive ? "secondary" : "textSubtle" }))}
            </TopMenuItem>
          </DropdownMenu>
        );
      })}
    </Flex>
  );
};

export default memo(TopMenuItems);
