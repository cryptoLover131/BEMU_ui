import { Currency, CurrencyAmount } from 'libraries/swap-sdk'
import { useCurrencyBalances } from 'state/wallet/hooks'
import tryParseAmount from 'utils/tryParseAmount'
import { useWeb3React } from 'libraries/wagmi'

export function useAccountInfo(
  typedValue: string,
  currency: Currency | undefined | null,
): {
  currency: Currency | undefined | null,
  currencyBalance?: CurrencyAmount<Currency>
  parsedAmount: CurrencyAmount<Currency> | undefined
  inputError?: string
} {
  const { account } = useWeb3React()

  const relevantTokenBalances = useCurrencyBalances(account ?? undefined, [
    currency ?? undefined,
  ])

  const parsedAmount = tryParseAmount(typedValue, currency ?? undefined)

  const currencyBalance = relevantTokenBalances[0]

  let inputError: string | undefined
  if (!account) {
    inputError = 'Connect Wallet'
  }

  if (!parsedAmount) {
    inputError = inputError ?? 'Enter an amount'
  }

  if (currencyBalance && currencyBalance.lessThan(parsedAmount?? 0)) {
    inputError = `Insufficient ${currencyBalance.currency.symbol} balance`
  }

  return {
    currency,
    currencyBalance,
    parsedAmount,
    inputError,
  }
}
