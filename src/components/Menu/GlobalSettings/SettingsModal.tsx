import { Flex } from 'components/Box'
import { InjectedModalProps, Modal } from 'widgets/Modal'
import { Text, PreTitle } from 'components/Text'
import { ThemeSwitcher } from 'components/ThemeSwitcher'
import useTheme from 'hooks/useTheme'
import { useCallback} from 'react'
import styled from 'styled-components'
import GasSettings from './GasSettings'
import TransactionSettings from './TransactionSettings'
import { SettingsMode } from './types'

const ScrollableContainer = styled(Flex)`
  flex-direction: column;
  height: auto;
  ${({ theme }) => theme.mediaQueries.xs} {
    max-height: 90vh;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    max-height: none;
  }
`

export const withCustomOnDismiss =
  (Component) =>
  ({
    onDismiss,
    customOnDismiss,
    mode,
    ...props
  }: {
    onDismiss?: () => void
    customOnDismiss: () => void
    mode: SettingsMode
  }) => {
    const handleDismiss = useCallback(() => {
      onDismiss?.()
      if (customOnDismiss) {
        customOnDismiss()
      }
    }, [customOnDismiss, onDismiss])

    return <Component {...props} mode={mode} onDismiss={handleDismiss} />
  }

const SettingsModal: React.FC<React.PropsWithChildren<InjectedModalProps>> = ({ onDismiss, mode }) => {
  const { isDark, setTheme } = useTheme()

  return (
    <Modal title='Settings' headerBackground="gradientCardHeader" onDismiss={onDismiss} minWidth={["100%", "418px"]}>
      <ScrollableContainer>
        {mode === SettingsMode.GLOBAL && (
          <>
            <Flex pb="24px" flexDirection="column">
              <PreTitle mb="24px">Global</PreTitle>
              <Flex justifyContent="space-between" mb="24px">
                <Text>Dark mode</Text>
                <ThemeSwitcher isDark={isDark} toggleTheme={() => setTheme(isDark ? 'light' : 'dark')} />
              </Flex>
              <GasSettings />
            </Flex>
          </>
        )}
        {mode === SettingsMode.SWAP_LIQUIDITY && (
          <>
            <Flex pt="3px" flexDirection="column">
              <TransactionSettings />
            </Flex>
          </>
        )}
      </ScrollableContainer>
    </Modal>
  )
}

export default SettingsModal
