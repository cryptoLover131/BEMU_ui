import { ReactNode } from "react";
import { AtomBox } from "../AtomBox";
import { Heading } from "../Heading";
import { Text } from "../Text";

interface Props {
  title: ReactNode;
  subtitle: ReactNode;
}

export const CurrencyInputHeader = ({ title, subtitle }: Props) => {
  return (
    <AtomBox width="100%" alignItems="center" flexDirection="column" pb="12px">
      <AtomBox display="flex" width="100%" alignItems="center" justifyContent="space-between">
        {title}
      </AtomBox>
      {subtitle}
    </AtomBox>
  );
};

export const CurrencyInputHeaderTitle = ({ children }: { children: ReactNode }) => (
  <Heading as="h2">{children}</Heading>
);
export const CurrencyInputHeaderSubTitle = ({ children }: { children: ReactNode }) => (
  <Text color="textSubtle" fontSize="14px" textAlign="center">
    {children}
  </Text>
);
