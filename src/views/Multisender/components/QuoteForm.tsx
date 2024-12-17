import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { Text, Box, Flex, LinkExternal } from 'components'
import { Currency } from 'libraries/swap-sdk'
import { GTOKEN } from 'libraries/tokens'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { getBlockExploreLink } from 'utils'
import { getMultiSenderAddress } from 'utils/addressHelpers'
import { AppHeader } from 'components/App'
import { CurrencyLogo } from 'components/Logo'
import { useAccount } from 'wagmi'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { CryptoFormView, DataType } from '../types'
import { FormContainer } from './FormContainer'
import DataTable from './DataTable'
import SendCommitButton from './SendCommitButton'
import ProgressCircles from './ProgressSteps'
import useFee from '../hooks/useFee'
import { useAccountInfo } from '../hooks/useAccountInfo'

export function QuoteForm({
  setModalView,
  data,
  tag,
  currency,
}: {
  setModalView: Dispatch<SetStateAction<CryptoFormView>>
  data: DataType[]
  tag: string
  currency: Currency | null
}) {
  const {chainId} = useActiveChainId()
  const { address: account } = useAccount()
  const feeRate = useFee()

  const amounts = data.map((row) => Math.floor(row.amount * 10 ** (currency?.decimals ?? 0))/10 ** (currency?.decimals ?? 0))
  const totalAmounts = amounts.reduce((amount0, amount1) => amount0 + Math.floor(amount1 * 10 ** (currency?.decimals ?? 0)), 0) / 10 ** (currency?.decimals ?? 0)
  const fee = new BigNumber(feeRate ?? 0).times(data.length).div(10**18)

  let totalAmountsPlusFee = new BigNumber(totalAmounts)

  if (GTOKEN[chainId] === currency) {
    totalAmountsPlusFee = totalAmountsPlusFee.plus(fee)
  }

  const {
    parsedAmount,
    inputError
  } = useAccountInfo(totalAmountsPlusFee.toFixed((currency?.decimals ?? 0)), currency)

  const {
    parsedAmount: parsedAmountForFee,
    inputError: inputErrorForFee
  } = useAccountInfo(fee.toFixed(18), GTOKEN[chainId])

  const {approvalState, approveCallback} = useApproveCallback(parsedAmount, getMultiSenderAddress(chainId))
  const {approvalState: approvalForFee, approveCallback: approveCallbackForFee} = useApproveCallback(parsedAmountForFee, getMultiSenderAddress(chainId))

  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)
  const [approvalSubmittedForFee, setApprovalSubmittedForFee] = useState<boolean>(false)

  useEffect(() => {
    if (approvalState === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
    if (approvalForFee === ApprovalState.PENDING) {
      setApprovalSubmittedForFee(true)
    }
  }, [approvalState, approvalSubmitted, approvalForFee, approvalSubmittedForFee])

  return (
    <Box p="10px 20px 20px" position="inherit">
      <AppHeader title='Multi-Sender' noConfig extra={{name: "History", link: "/multisend/history"}} />
      <FormContainer>
        <ProgressCircles steps={[false]} />
        <Box>
          <Text fontSize="16px" color="primary">2. Confirm Allocation</Text>
          <Text fontSize="14px">Enter your token to be send with allocations</Text>
        </Box>
        <Box my="20px">
          <Flex width="100%" px="20px">
            <CurrencyLogo size="32px" currency={currency} />
            <Text fontSize="20px" ml="8px">{currency?.symbol ?? "Unknown"}</Text>
          </Flex>
          {!currency?.isNative && <Flex width="100%" justifyContent="space-between" px="20px" my="10px">
            <Text fontSize="14px">Token Address</Text>
            <LinkExternal href={getBlockExploreLink(currency?.wrapped.address, 'address', chainId)}>
              <Text fontSize="14px">{`${currency?.wrapped.address.substring(0, 6)}...${currency?.wrapped.address.substring(currency?.wrapped.address.length - 4)}`}</Text>
            </LinkExternal>
          </Flex>}
          <Flex width="100%" justifyContent="space-between" px="20px" my="10px">
            <Text fontSize="14px">Tag</Text>
            <Text fontSize="14px">{tag}</Text>
          </Flex>
          <Flex width="100%" justifyContent="space-between" px="20px" my="10px">
            <Text fontSize="14px">Total Receivers</Text>
            <Text fontSize="14px">{data.length}</Text>
          </Flex>
          <Flex width="100%" justifyContent="space-between" px="20px" my="10px">
            <Text fontSize="14px">Total Amount to send</Text>
            <Text fontSize="14px">{Number(totalAmounts.toFixed(currency?.decimals))} {currency?.symbol ?? ""}</Text>
          </Flex>
          <Flex width="100%" justifyContent="space-between" px="20px" my="10px">
            <Text fontSize="14px">Transaction Fee</Text>
            <Text fontSize="14px">{Number(fee.toFixed(18))} DKO</Text>
          </Flex>
          <DataTable data={data} />
        </Box>
        <SendCommitButton
          data={data}
          tag={tag}
          account={account}
          approval={approvalState}
          approveCallback={approveCallback}
          approvalSubmitted={approvalSubmitted}
          setApprovalSubmitted={setApprovalSubmitted}
          approvalForFee={approvalForFee}
          approveCallbackForFee={approveCallbackForFee}
          approvalSubmittedForFee={approvalSubmittedForFee}
          setApprovalSubmittedForFee={setApprovalSubmittedForFee}
          currency={currency}
          swapInputError={inputError}
          swapInputErrorForFee={inputErrorForFee}
          setModalView={setModalView}
        />
      </FormContainer>
    </Box>
  )
}
