import { MenuItemsType } from 'widgets/Menu'
import { DropdownMenuItems } from 'components/DropdownMenu'
import {
  EarnFillIcon,
  EarnIcon,
  MultisenderIcon,
  TradeIcon
} from '../../Svg'

export type ConfigMenuDropDownItemsType = DropdownMenuItems & { hideSubNav?: boolean }
export type ConfigMenuItemsType = Omit<MenuItemsType, 'items'> & { hideSubNav?: boolean; image?: string } & {
  items?: ConfigMenuDropDownItemsType[]
}

const addMenuItemSupported = (item, chainId) => {
  if (!chainId || !item.supportChainIds) {
    return item
  }
  if (item.supportChainIds?.includes(chainId)) {
    return item
  }
  return {
    ...item,
    disabled: true,
  }
}

const config: (
  isDark: boolean,
  chainId?: number,
) => ConfigMenuItemsType[] = (isDark, chainId) =>
  [
    {
      label: 'Swap',
      icon: TradeIcon,
      fillIcon: TradeIcon,
      href: '/swap',
      showItemsOnMobile: true,
      items: [].map((item) => addMenuItemSupported(item, chainId)),
    },
    {
      label: 'Pool',
      icon: TradeIcon,
      fillIcon: TradeIcon,
      href: '/pool',
      showItemsOnMobile: true,
      items: [].map((item) => addMenuItemSupported(item, chainId)),
    },
  ].map((item) => addMenuItemSupported(item, chainId))

export default config
