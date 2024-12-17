import React, { useContext, useRef, useEffect } from "react";
import { useMatchBreakpoints } from "contexts";
import { MenuContext } from "widgets/Menu/context";
import { StyledTopMenuItemContainer, StyledTopMenuItem } from "./styles";
import { MenuItemProps } from "./types";

const MenuItem: React.FC<React.PropsWithChildren<MenuItemProps>> = ({
  children,
  href,
  isActive = false,
  isDisabled = false,
  variant = "default",
  scrollLayerRef,
  statusColor,
  hasSubItem = false,
  ...props
}) => {
  const { isMobile } = useMatchBreakpoints();
  const menuItemRef = useRef<HTMLDivElement>(null);
  const { linkComponent } = useContext(MenuContext);
  const link = href === "/docs" ? "https://docs.noiexchange.net/" : href;
  const target = href === "/docs"? "_blank" : "";
  const itemLinkProps: any = link && !hasSubItem
    ? {
        as: linkComponent,
        href: link,
        target,
      }
    : {
        as: "div",
      };
  useEffect(() => {
    if (!isMobile || !isActive || !menuItemRef.current || !scrollLayerRef?.current) return;
    const scrollLayer = scrollLayerRef.current;
    const menuNode = menuItemRef.current.parentNode as HTMLDivElement;
    if (!menuNode) return;
    if (
      scrollLayer.scrollLeft > menuNode.offsetLeft ||
      scrollLayer.scrollLeft + scrollLayer.offsetWidth < menuNode.offsetLeft + menuNode.offsetWidth
    ) {
      scrollLayer.scrollLeft = menuNode.offsetLeft;
    }
  }, [isActive, isMobile, scrollLayerRef]);
  return (
    <StyledTopMenuItemContainer $isActive={isActive} $variant={variant} ref={menuItemRef}>
      <StyledTopMenuItem
        {...itemLinkProps}
        $isActive={isActive}
        $isDisabled={isDisabled}
        $variant={variant}
        $statusColor={statusColor}
        {...props}
      >
        {children}
      </StyledTopMenuItem>
    </StyledTopMenuItemContainer>
  );
};

export default MenuItem;
