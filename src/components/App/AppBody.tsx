import styled from 'styled-components'
import { Card } from '../Card'

export const BodyWrapper = styled(Card)`
  border-radius: 23px;
  max-width: 464px;
  width: 100%;
  z-index: 1;
`
interface AppBodyProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void; // Add optional onClick prop
}

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children, onClick }: AppBodyProps) {
  return (
    <BodyWrapper padding="12px" onClick={onClick}>
      {children}
    </BodyWrapper>
  );
}
