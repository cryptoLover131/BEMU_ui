import styled from 'styled-components'
import { Text, Flex, IconButton, ArrowBackIcon, NotificationDot, Button, NextLinkFromReactRouter } from 'components'
import GlobalSettings from 'components/Menu/GlobalSettings'
import Link from 'next/link'
import { SettingsMode } from '../Menu/GlobalSettings/types'

interface Props {
  title: string
  backTo?: string | (() => void)
  noConfig?: boolean
  extra?: {
    name: string,
    link: string
  }
}

const AppHeaderContainer = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  width: 100%;
  // border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
`

const AppHeader: React.FC<React.PropsWithChildren<Props>> = ({ title, backTo, noConfig = false, extra }) => {
  return (
    <AppHeaderContainer>
      <Flex alignItems="center" width="100%" style={{ gap: '16px' }} height="36px">
        {backTo &&
          (typeof backTo === 'string' ? (
            <Link passHref href={backTo} style={{height: "32px"}}>
              {/* <IconButton as="a" scale="sm"> */}
                <ArrowBackIcon width="32px" />
              {/* </IconButton> */}
            </Link>
          ) : (
            <IconButton scale="sm" variant="text" onClick={backTo}>
              <ArrowBackIcon width="32px" />
            </IconButton>
          ))}
        <Flex flexDirection="column" width="100%" >
          <Flex alignItems="center" justifyContent="space-between">
            <Flex>
              <Text>{title}</Text>
            </Flex>
              <Flex alignItems="center">
              {!noConfig && (
                <NotificationDot>
                  <GlobalSettings mode={SettingsMode.SWAP_LIQUIDITY} mr="0" />
                </NotificationDot>
              )}
              {extra && (
                <Button
                  as={NextLinkFromReactRouter}
                  to={extra.link}
                  variant="secondary"
                  height="36px"
                  px="10px"
                >
                  {extra.name}
                </Button>
              )}
              </Flex>
          </Flex>
        </Flex>
      </Flex>
    </AppHeaderContainer>
  )
}

export default AppHeader
