import { ReactNode } from "react";
import BigNumber from "bignumber.js";
import { Token } from "libraries/swap-sdk";
import { DeserializedFarm } from "libraries/farms";

export interface FarmTableEarnedProps {
  earnings: number;
  pid: number;
}

export interface FarmTableLiquidityProps {
  liquidity: BigNumber;
}

export interface FarmTableMultiplierProps {
  multiplier: string;
  rewardCakePerSecond?: boolean;
  isTokenOnly?: boolean;
}

export interface FarmTableFarmTokenInfoProps {
  label: string;
  pid: number;
  token: Token;
  quoteToken: Token;
  isReady: boolean;
  stakedBalance?: BigNumber;
  children?: ReactNode;
  isTokenOnly?: boolean
}

export interface FarmTableFarmNameProps {
  label: string;
  pid: number;
  token: Token;
  quoteToken: Token;
  isReady: boolean;
  stakedBalance?: BigNumber;
  children?: ReactNode;
  isTokenOnly?: boolean
}

export interface FarmWithStakedValue extends DeserializedFarm {
  apr?: number | null
  lpRewardsApr?: number
  liquidity?: BigNumber
}

export type ColumnsDefTypes = {
  id: number;
  label: string;
  name: string;
  sortable: boolean;
};

export const DesktopColumnSchema: ColumnsDefTypes[] = [
  {
    id: 1,
    name: "farm",
    sortable: false,
    label: "",
  },
  {
    id: 2,
    name: "name",
    sortable: true,
    label: "",
  },
  {
    id: 3,
    name: "earned",
    sortable: true,
    label: "Earned",
  },
  {
    id: 4,
    name: "apr",
    sortable: true,
    label: "APR",
  },
  {
    id: 5,
    name: "liquidity",
    sortable: true,
    label: "Total Staked",
  },
  {
    id: 6,
    name: "details",
    sortable: true,
    label: "",
  },
];

export const MobileColumnSchema: ColumnsDefTypes[] = [
  {
    id: 1,
    name: "farm",
    sortable: false,
    label: "",
  },
  {
    id: 2,
    name: "name",
    sortable: true,
    label: "",
  },
  {
    id: 3,
    name: "liquidity",
    sortable: true,
    label: "Total Staked",
  },
  {
    id: 4,
    name: "apr",
    sortable: true,
    label: "APR",
  },
  {
    id: 5,
    name: "details",
    sortable: true,
    label: "",
  },
];