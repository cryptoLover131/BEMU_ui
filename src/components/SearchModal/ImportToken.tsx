import { useState } from 'react'
import { ChainId } from 'config/chains'
import { Token, Currency } from 'libraries/swap-sdk'
import {
  Button,
  Text,
  Flex,
  Checkbox,
  Link,
  Grid,
  BscScanIcon,
} from 'components'
import { AutoColumn } from 'components/Layout/Column'
import { useAddUserToken } from 'state/user/hooks'
import { getBlockExploreLink, getBlockExploreName } from 'utils'
import truncateHash from 'utils/truncateHash'
import { chains } from 'utils/wagmi'
import { useActiveChainId } from 'hooks/useActiveChainId'

interface ImportProps {
  tokens: Token[]
  handleCurrencySelect?: (currency: Currency) => void
}

const getStandard = (chainId: ChainId) =>
  chainId !== ChainId.BSC ? 'ERC20' : 'BEP20'

function ImportToken({ tokens, handleCurrencySelect }: ImportProps) {
  const { chainId } = useActiveChainId()

  const [confirmed, setConfirmed] = useState(false)

  const addToken = useAddUserToken()

  return (
    <AutoColumn gap="lg">
        <Text>
          {`Anyone can create a ${getStandard(chainId)} token on ${chains.find((c) => c.id === chainId)?.name ?? ""} with any name, including creating fake versions of existing tokens and tokens that claim to represent projects that do not have a token.`}
          {' If you purchase an arbitrary token, you may be unable to sell it back.'}
        </Text>

      {tokens.map((token) => {
        const address = token.address ? `${truncateHash(token.address, 6)}` : null
        return (
          <>
            <Flex alignItems="center" justifyContent="space-between">
              {token.chainId && (
                <Link href={getBlockExploreLink(token.address, 'address', token.chainId)} external>
                  {`View on ${getBlockExploreName(token.chainId)}`}
                  {token.chainId === ChainId.BSC && <BscScanIcon color="primary" ml="4px" />}
                </Link>
              )}
            </Flex>
            <Flex alignItems="center" justifyContent="space-between">
              <Flex alignItems="center">
                <Text mr="8px">{token.name}</Text>
                <Text>({token.symbol})</Text>
              </Flex>
              <Text mr="4px">{address}</Text>
            </Flex>
          </>
        )
      })}

      <Grid gridTemplateRows="1fr 1fr" gridGap="4px">
        <Flex alignItems="center" onClick={() => setConfirmed(!confirmed)}>
          <Checkbox
            scale="sm"
            name="confirmed"
            type="checkbox"
            checked={confirmed}
            onChange={() => setConfirmed(!confirmed)}
          />
          <Text ml="8px" style={{ userSelect: 'none' }}>
          I understand
          </Text>
        </Flex>
        <Button
          variant="danger"
          disabled={!confirmed}
          onClick={() => {
            tokens.forEach((token) => {
              addToken(token)
            })
            if (handleCurrencySelect) {
              handleCurrencySelect(tokens[0])
            }
          }}
          className=".token-dismiss-button"
        >
          Import
        </Button>
      </Grid>
    </AutoColumn>
  )
}

export default ImportToken
