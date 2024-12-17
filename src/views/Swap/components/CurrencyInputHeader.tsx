import { Button, Flex, NextLinkFromReactRouter, Text } from 'components'
import { ReactElement } from 'react'
import GlobalSettings from 'components/Menu/GlobalSettings'
import { CurrencyInputHeader as AtomCurrencyInputHeader } from 'components/CurrencyInputHeader'
import { SettingsMode } from 'components/Menu/GlobalSettings/types'

interface Props {
  title: string | ReactElement
}

const CurrencyInputHeader: React.FC<React.PropsWithChildren<Props>> = ({
  title,
}) => {
  const titleContent = (
    <Flex width="100%" alignItems="center" justifyContent="space-between" flexDirection="row">
      <Flex>
        <Button
          as={NextLinkFromReactRouter}
          to='/swap'
          variant={title === "Swap" ? 'secondary' : 'text'}
          width="70px"
          height="36px"
        >
          <Text>Swap</Text>
        </Button>
        <Button
          as={NextLinkFromReactRouter}
          to='/pool'
          variant={title === "Pool" ? 'secondary' : 'text'}
          width="70px"
          height="36px"
        >
          <Text>Pool</Text>
        </Button>
      </Flex>
      <Flex justifyContent="end">
        <GlobalSettings color="textSubtle" mr="0" mode={SettingsMode.SWAP_LIQUIDITY} />
      </Flex>
    </Flex>
  )

  return <AtomCurrencyInputHeader title={titleContent} subtitle={<></>} />
}

export default CurrencyInputHeader
