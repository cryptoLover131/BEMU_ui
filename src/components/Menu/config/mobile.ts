import { MenuItemsType } from 'widgets/Menu'
import { DropdownMenuItems } from 'components/DropdownMenu'
import {
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
  chainId?: number,
) => ConfigMenuItemsType[] = (chainId) =>
  [
    {
      label: 'Explore',
      icon: TradeIcon,
      fillIcon: TradeIcon,
      href: '',
      showItemsOnMobile: true,
      items: [
        {
          label: 'Swap',
          href: '/swap',
        },
        {
          label: 'Pool',
          href: '/pool',
        },
      ].map((item) => addMenuItemSupported(item, chainId)),
    },
  ].map((item) => addMenuItemSupported(item, chainId))

export default config
