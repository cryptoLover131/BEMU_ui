import { ONE_BIPS } from 'config/constants/exchange'
import { Currency, Percent, Price } from 'libraries/swap-sdk'
import { Text } from 'components/Text'
import { AutoColumn } from 'components/Layout/Column'
import { AutoRow } from 'components/Layout/Row'
import { Field } from 'state/mint/actions'

function PoolPriceBar({
  currencies,
  noLiquidity,
  poolTokenPercentage,
  price,
}: {
  currencies: { [field in Field]?: Currency }
  noLiquidity?: boolean
  poolTokenPercentage?: Percent
  price?: Price<Currency, Currency>
}) {
  return (
    <AutoColumn gap="md">
      <AutoRow justify="space-around" gap="4px">
        <AutoColumn justify="center">
          <Text>{price?.toSignificant(6) ?? '-'}</Text>
          <Text fontSize="14px" pt={1}>
            {currencies[Field.CURRENCY_B]?.symbol ?? ''} per {currencies[Field.CURRENCY_A]?.symbol ?? ''}
          </Text>
        </AutoColumn>
        <AutoColumn justify="center">
          <Text>{price?.invert()?.toSignificant(6) ?? '-'}</Text>
          <Text fontSize="14px" pt={1}>
            {currencies[Field.CURRENCY_A]?.symbol ?? ''} per {currencies[Field.CURRENCY_B]?.symbol ?? ''}
          </Text>
        </AutoColumn>
        <AutoColumn justify="center">
          <Text>
            {noLiquidity && price
              ? '100'
              : (poolTokenPercentage?.lessThan(ONE_BIPS) ? '<0.01' : poolTokenPercentage?.toFixed(2)) ?? '0'}
            %
          </Text>
          <Text fontSize="14px" pt={1}>
            Share in Trading Pair
          </Text>
        </AutoColumn>
      </AutoRow>
    </AutoColumn>
  )
}

export default PoolPriceBar
