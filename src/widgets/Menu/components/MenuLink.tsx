import React, { useContext, useEffect, useRef } from "react";
import { useMatchBreakpoints } from "contexts";
import { Link } from "components";
import { MenuContext } from "../context";

export interface MenuLinkProps {
  isActive?: boolean;
  href?: string;
  scrollLayerRef?: React.RefObject<HTMLDivElement>;
}

const MenuLink: React.FC<React.PropsWithChildren<MenuLinkProps>> = ({ isActive, href, scrollLayerRef, ...props }) => {
  const { isMobile } = useMatchBreakpoints();
  const { linkComponent } = useContext(MenuContext);
  const menuItemRef = useRef<HTMLDivElement>(null);
  const link = href === "/docs" ? "https://docs.noiexchange.net/" : href;
  const target = href === "/docs"? "_blank" : "";
  const itemLinkProps: any = link
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
    <div ref={menuItemRef}>
      <Link {...itemLinkProps} {...props} />
    </div>
  );
};

export default MenuLink;
