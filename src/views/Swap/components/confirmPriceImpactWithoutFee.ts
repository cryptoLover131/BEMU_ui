import { Percent } from "libraries/swap-sdk-core";

/**
 * Given the price impact, get user confirmation.
 *
 * @param priceImpactWithoutFee price impact of the trade without the fee.
 * @param t Translation
 */
export function confirmPriceImpactWithoutFee(
  priceImpactWithoutFee: Percent,
  priceImpactWithoutFeeConfirmMin: Percent,
  allowedPriceImpactHigh: Percent,
): boolean {
  if (!priceImpactWithoutFee.lessThan(priceImpactWithoutFeeConfirmMin)) {
    const confirmWord = "confirm";
    return (
      // eslint-disable-next-line no-alert
      window.prompt(
        `This swap has a price impact of at least ${priceImpactWithoutFeeConfirmMin.toFixed(0)}%. Please type the word "${confirmWord}" to continue with this swap.`
      ) === confirmWord
    );
  }
  if (!priceImpactWithoutFee.lessThan(allowedPriceImpactHigh)) {
    // eslint-disable-next-line no-alert
    return window.confirm(
      `This swap has a price impact of at least ${allowedPriceImpactHigh.toFixed(0)}%. Please confirm that you would like to continue with this swap.`
    );
  }
  return true;
}
