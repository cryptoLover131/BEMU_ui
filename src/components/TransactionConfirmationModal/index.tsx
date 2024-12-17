import { useCallback } from 'react'
import { ChainId } from 'config/chains'
import { Currency } from 'libraries/swap-sdk'
import styled from 'styled-components'
import { Text, ArrowUpIcon, Link } from 'components'
import { Modal, ModalProps, InjectedModalProps } from 'widgets/Modal'
import { ConfirmationPendingContent } from 'widgets/ConfirmationPendingContent'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { AutoColumn, ColumnCenter } from '../Layout/Column'
import { getBlockExploreLink } from '../../utils'

const Wrapper = styled.div`
  width: 100%;
`
const Section = styled(AutoColumn)`
  padding: 24px;
`

const ConfirmedIcon = styled(ColumnCenter)`
  padding: 24px 0;
`

export function TransactionSubmittedContent({
  chainId,
  hash,
}: {
  hash: string | undefined
  chainId: ChainId
}) {
  return (
    <Wrapper>
      <Section>
        <ConfirmedIcon>
          <ArrowUpIcon strokeWidth={0.5} width="90px" color="primary" />
        </ConfirmedIcon>
        <AutoColumn gap="12px" justify="center">
          <Text fontSize="20px">Transaction Submitted</Text>
          {chainId && hash && (
            <Link external small href={getBlockExploreLink(hash, 'transaction', chainId)}>
              <Text fontSize="14x">View on Explorer</Text>
            </Link>
          )}
        </AutoColumn>
      </Section>
    </Wrapper>
  )
}

interface ConfirmationModalProps {
  title: string
  customOnDismiss?: () => void
  hash: string | undefined
  content: () => React.ReactNode
  attemptingTxn: boolean
  pendingText: string
  currencyToAdd?: Currency | undefined | null
}

const TransactionConfirmationModal: React.FC<
  React.PropsWithChildren<InjectedModalProps & ConfirmationModalProps & ModalProps>
> = ({ title, onDismiss, customOnDismiss, attemptingTxn, hash, pendingText, content, ...props }) => {
  const { chainId } = useActiveChainId()

  const handleDismiss = useCallback(() => {
    if (customOnDismiss) {
      customOnDismiss()
    }
    onDismiss?.()
  }, [customOnDismiss, onDismiss])

  if (!chainId) return null

  return (
    // <Modal title={title} headerBackground="gradientCardHeader" {...props} onDismiss={handleDismiss}>
    <Modal title={title} {...props} onDismiss={handleDismiss}>
      {attemptingTxn ? (
        <ConfirmationPendingContent pendingText={pendingText} />
      ) : hash ? (
        <TransactionSubmittedContent
          chainId={chainId}
          hash={hash}
        />
      ) : (
        content()
      )}
    </Modal>
  )
}

export default TransactionConfirmationModal
