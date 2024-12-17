import { ElementType, ReactElement, ReactNode } from "react";
import { MenuItemsType } from "components/MenuItems/types";
import { SubMenuItemsType } from "components/SubMenuItems/types";
import { FooterLinkType } from "components/Footer/types";
import { Colors } from "theme/types";

export interface LinkStatus {
  text: string;
  color: keyof Colors;
}

export interface NavProps {
  linkComponent?: ElementType;
  rightSide?: ReactNode;
  banner?: ReactElement;
  links: Array<MenuItemsType>;
  mobileLinks: Array<MenuItemsType>;
  subLinks?: Array<SubMenuItemsType>;
  activeItem?: string;
  activeSubItem?: string;
  footerLinks: Array<FooterLinkType>;
  cakePriceUsd?: number;
  chainId: number;
}

export interface PanelProps {
  isDark: boolean;
  toggleTheme: (isDark: boolean) => void;
  cakePriceUsd?: number;
  chainId: number;
  links: Array<MenuItemsType>;
  activeItem: string | undefined;
  activeSubItem: string | undefined;
}

export interface PushedProps {
  isPushed: boolean;
  pushNav: (isPushed: boolean) => void;
}
