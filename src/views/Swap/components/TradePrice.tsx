import { Price, Currency } from "libraries/swap-sdk-core";
import { AtomBox } from "components/AtomBox";
import { useState } from "react";
// import * as styles from "theme/css/SwapWidget.css";
import { AutoRenewIcon } from "components/Svg";
import { Text } from "components/Text";

interface TradePriceProps {
  price?: Price<Currency, Currency>;
}

export function TradePrice({ price }: TradePriceProps) {
  const [showInverted, setShowInverted] = useState<boolean>(false);
  const formattedPrice = showInverted ? price?.toSignificant(6) : price?.invert()?.toSignificant(6);

  const show = Boolean(price?.baseCurrency && price?.quoteCurrency);
  const label = showInverted
    ? `${price?.quoteCurrency?.symbol} per ${price?.baseCurrency?.symbol}`
    : `${price?.baseCurrency?.symbol} per ${price?.quoteCurrency?.symbol}`;

  return (
    <Text style={{ justifyContent: "center", alignItems: "center", display: "flex", fontSize: "14px" }}>
      {show ? (
        <>
          {formattedPrice ?? "-"} {label}
          <AtomBox onClick={() => setShowInverted(!showInverted)}>
            <AutoRenewIcon width="14px" />
          </AtomBox>
        </>
      ) : (
        "-"
      )}
    </Text>
  );
}
