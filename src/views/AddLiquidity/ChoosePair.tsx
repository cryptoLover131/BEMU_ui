import { useWeb3Modal } from '@web3modal/wagmi/react'
import { Currency } from 'libraries/swap-sdk'
import { AddIcon, Box, CardBody, Text, FlexGap, Button } from 'components'
import { CommitButton } from 'components/CommitButton'
import { CurrencySelect } from 'components/CurrencySelect'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { AppHeader } from '../../components/App'
import { CommonBasesType } from '../../components/SearchModal/types'
import { useCurrencySelectRoute } from './useCurrencySelectRoute'

export function ChoosePair({
  currencyA,
  currencyB,
  error,
  onNext,
}: {
  currencyA?: Currency
  currencyB?: Currency
  error?: string
  onNext?: () => void
}) {
  const { account } = useAccountActiveChain()
  const { open } = useWeb3Modal()
  const isValid = !error
  const { handleCurrencyASelect, handleCurrencyBSelect } = useCurrencySelectRoute()

  return (
    <>
      <AppHeader
        title='Add Liquidity'
        backTo="/pool"
      />
      <CardBody mt="10px">
        <Box>
          <Text textTransform="uppercase" color="secondary" small pb="24px">
            Choose a valid pair
          </Text>
          <FlexGap gap="4px">
            <CurrencySelect
              id="add-liquidity-select-tokena"
              selectedCurrency={currencyA}
              onCurrencySelect={handleCurrencyASelect}
              showCommonBases
              commonBasesType={CommonBasesType.LIQUIDITY}
            />
            <AddIcon color="textSubtle" />
            <CurrencySelect
              id="add-liquidity-select-tokenb"
              selectedCurrency={currencyB}
              onCurrencySelect={handleCurrencyBSelect}
              showCommonBases
              commonBasesType={CommonBasesType.LIQUIDITY}
            />
          </FlexGap>
        </Box>
      </CardBody>
      {!account ? (
        <Button
          width="100%"
          variant='primary'
          height="48px"
          onClick={() => open()}
        >
          <Text fontSize="16px">
            Connect Wallet
          </Text>
        </Button>
      ) : (
        <CommitButton
          data-test="choose-pair-next"
          width="100%"
          variant={!isValid ? 'danger' : 'primary'}
          onClick={onNext}
          disabled={!isValid}
          height="48px"
        >
          {error ?? 'Add Liquidity'}
        </CommitButton>
      )}
    </>
  )
}
