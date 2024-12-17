import { FlexProps } from "../Box";

export type FooterLinkType = {
  label: string;
  href?: string;
  isHighlighted?: boolean;
  items: { label: string; href?: string; isHighlighted?: boolean; blank?: boolean; }[];
};

export type FooterProps = {
  items: FooterLinkType[];
  cakePriceUsd?: number;
  chainId: number;
} & FlexProps;
