import { Flex, Button, Text, QuestionHelper } from 'components'
import { useGasPriceManager } from 'state/user/hooks'
import { GAS_PRICE_GWEI, GAS_PRICE } from 'state/types'

const GasSettings = () => {
  const [gasPrice, setGasPrice] = useGasPriceManager()

  return (
    <Flex flexDirection="column">
      <Flex mb="12px" alignItems="center">
        <Text>Default Transaction Speed (GWEI)</Text>
        <QuestionHelper
          text={
            <Flex flexDirection="column">
              <Text>
                Adjusts the gas price (transaction fee) for your transaction. Higher GWEI = higher speed = higher fees.
              </Text>
              <Text mt="8px">Choose “Default” to use the settings from your current blockchain RPC node.</Text>
            </Flex>
          }
          placement="top"
          ml="4px"
        />
      </Flex>
      <Flex flexWrap="wrap">
        <Button
          mt="4px"
          mr="4px"
          scale="sm"
          onClick={() => {
            setGasPrice(GAS_PRICE_GWEI.rpcDefault)
          }}
          variant={gasPrice === GAS_PRICE_GWEI.rpcDefault ? 'primary' : 'tertiary'}
        >
          Default
        </Button>
        <Button
          mt="4px"
          mr="4px"
          scale="sm"
          onClick={() => {
            setGasPrice(GAS_PRICE_GWEI.default)
          }}
          variant={gasPrice === GAS_PRICE_GWEI.default ? 'primary' : 'tertiary'}
        >
          Standard ({GAS_PRICE.default})
        </Button>
        <Button
          mt="4px"
          mr="4px"
          scale="sm"
          onClick={() => {
            setGasPrice(GAS_PRICE_GWEI.fast)
          }}
          variant={gasPrice === GAS_PRICE_GWEI.fast ? 'primary' : 'tertiary'}
        >
          Fast ({GAS_PRICE.fast})
        </Button>
        <Button
          mr="4px"
          mt="4px"
          scale="sm"
          onClick={() => {
            setGasPrice(GAS_PRICE_GWEI.instant)
          }}
          variant={gasPrice === GAS_PRICE_GWEI.instant ? 'primary' : 'tertiary'}
        >
          Instant ({GAS_PRICE.instant})
        </Button>
      </Flex>
    </Flex>
  )
}

export default GasSettings
