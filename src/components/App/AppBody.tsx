import styled from 'styled-components'
import { Card } from '../Card'

export const BodyWrapper = styled(Card)`
  border-radius: 23px;
  max-width: 464px;
  width: 100%;
  z-index: 1;
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children }: { children: React.ReactNode }) {
  return <BodyWrapper padding="12px">{children}</BodyWrapper>
}
