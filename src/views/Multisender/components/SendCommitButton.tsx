import { Dispatch, SetStateAction } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { Currency } from 'libraries/swap-sdk'
import { GTOKEN } from 'libraries/tokens'
import { Flex } from 'components'
import { useToast } from 'contexts'
import { BIG_TEN } from 'utils/bigNumber'
import { CommitButton } from 'components/CommitButton'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { AutoRow } from 'components/Layout/Row'
import CircleLoader from 'components/Loader/CircleLoader'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { ApprovalState } from 'hooks/useApproveCallback'
import useCatchTxError from 'hooks/useCatchTxError'
import { ToastDescriptionWithTx } from 'components/Toast'
import { CryptoFormView, DataType } from '../types'
import useSendToken from '../hooks/useSendToken'
import useSendEther from '../hooks/useSendEther'

const StyledFlex = styled(Flex)`
  width: 100%;
  flex-direction: column;
  align-items: center;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
  }
`

interface SendCommitButtonPropsType<SendTransactionReturnType> {
  data: DataType[]
  tag: string
  account?: `0x${string}`
  approval: ApprovalState
  approveCallback: () => Promise<SendTransactionReturnType>
  approvalSubmitted: boolean
  setApprovalSubmitted: (b: boolean) => void
  approvalForFee: ApprovalState
  approveCallbackForFee: () => Promise<SendTransactionReturnType>
  approvalSubmittedForFee: boolean
  setApprovalSubmittedForFee: (b: boolean) => void
  currency?: Currency | null
  swapInputError?: string
  swapInputErrorForFee?: string
  setModalView: Dispatch<SetStateAction<CryptoFormView>>
}

export default function SendCommitButton<SendTransactionReturnType>({
  data,
  tag,
  account,
  approval,
  approveCallback,
  approvalSubmitted,
  setApprovalSubmitted,
  approvalForFee,
  approveCallbackForFee,
  approvalSubmittedForFee,
  setApprovalSubmittedForFee,
  currency,
  swapInputError,
  swapInputErrorForFee,
  // parsedAmount,
  setModalView
}: SendCommitButtonPropsType<SendTransactionReturnType>) {
  const { chainId } = useActiveChainId()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()

  const { onSendToken } = useSendToken()
  const { onSendEther } = useSendEther()

  const addresses = data.map((row) => row.address)
  const amounts = data.map((row) => Math.floor(row.amount * 10 ** (currency?.decimals ?? 0)))
  const amountsInString = data.map((row) => new BigNumber(row.amount).times(BIG_TEN.pow(currency?.decimals ?? 0)).toFixed())
  const totalAmount = amounts.reduce((sum, current) => sum + Number(current), 0) / 10 ** (currency?.decimals ?? 0)
  const handleCommit = async () => {
    const receipt = currency?.isNative ? 
      await fetchWithCatchTxError(() => onSendEther(totalAmount, addresses, amountsInString, tag)) : 
      await fetchWithCatchTxError(() => onSendToken(currency?.wrapped?.address ?? "", addresses, amountsInString, tag))
    setApprovalSubmitted(false)
    setApprovalSubmittedForFee(false)

    if (receipt?.status) {
      toastSuccess(
        'Confirmed!',
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          Your ${currency?.symbol ?? "Unknown"} have been sent to the receivers!
        </ToastDescriptionWithTx>,
      
      )
      setModalView(CryptoFormView.Input)
    }
  }

  if (!account) {
    return <ConnectWalletButton />
  }

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !swapInputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED))

  const showApproveFlowForFee =
    !swapInputError &&
    (approvalForFee === ApprovalState.NOT_APPROVED ||
      approvalForFee === ApprovalState.PENDING ||
      (approvalSubmittedForFee && approvalForFee === ApprovalState.APPROVED))

  const isValid = !swapInputError
  const isValidForFee = !swapInputErrorForFee

  const approved = approval === ApprovalState.APPROVED
  const approvedForFee = approvalForFee === ApprovalState.APPROVED

  if (showApproveFlow || showApproveFlowForFee) {
    return (
      <>
        <StyledFlex>
          {showApproveFlow && <CommitButton
            variant={approval === ApprovalState.APPROVED ? 'success' : 'primary'}
            onClick={approveCallback}
            disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
            width="100%"
            margin="10px"
            height="36px"
          >
            {approval === ApprovalState.PENDING ? (
              <AutoRow gap="6px" justify="center">
                Enabling <CircleLoader stroke="white" />
              </AutoRow>
            ) : approvalSubmitted && approved ? (
              `${currency?.symbol ?? ''} Enabled`
            ) : (
              `Enable ${currency?.symbol ?? ''}`
            )}
          </CommitButton>}
          {showApproveFlowForFee && (currency !== GTOKEN[chainId]) && <CommitButton
            variant={approvalForFee === ApprovalState.APPROVED ? 'success' : 'primary'}
            onClick={approveCallbackForFee}
            disabled={approvalForFee !== ApprovalState.NOT_APPROVED || approvalSubmittedForFee}
            width="100%"
            margin="10px"
            height="36px"
          >
            {approvalForFee === ApprovalState.PENDING ? (
              <AutoRow gap="6px" justify="center">
                Enabling <CircleLoader stroke="white" />
              </AutoRow>
            ) : approvalSubmittedForFee && approvedForFee ? (
              'DKO Enabled'
            ) : (
              "Enable DKO"
            )}
          </CommitButton>}
        </StyledFlex>
        <StyledFlex>
          <CommitButton
            variant="secondary"
            onClick={() => setModalView(CryptoFormView.Input)}
            width="100%"
            margin="10px"
            height="36px"
          >
            Back
          </CommitButton>
          <CommitButton
            variant='primary'
            onClick={handleCommit}
            width="100%"
            id="swap-button"
            disabled={!isValid || !approved || pendingTx || !isValidForFee || !approvedForFee}
            margin="10px"
            height="36px"
          >
            {
              pendingTx ? 
                <AutoRow gap="6px" justify="center">
                  Confirming <CircleLoader stroke="white" />
                </AutoRow> 
              : 
                'Confirm'
            }
          </CommitButton>
        </StyledFlex>
        {/* <Column style={{ marginTop: '1rem' }}>
          <ProgressSteps steps={[approval === ApprovalState.APPROVED]} />
        </Column> */}
      </>
    )
  }

  return (
    <StyledFlex>
      <CommitButton
        variant="secondary"
        onClick={() => setModalView(CryptoFormView.Input)}
        width="100%"
        margin="10px"
        height="36px"
      >
        Back
      </CommitButton>
      <CommitButton
        variant='primary'
        onClick={handleCommit}
        id="swap-button"
        width="100%"
        margin="10px"
        disabled={!isValid || !approved || pendingTx || !isValidForFee || !approvedForFee}
        height="36px"
      >
        {swapInputError ||
          (pendingTx ? 
            <AutoRow gap="6px" justify="center">
              Confirming <CircleLoader stroke="white" />
            </AutoRow>
          : 
          'Confirm'
          )}
      </CommitButton>
    </StyledFlex>
  )
}
