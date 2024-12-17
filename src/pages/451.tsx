import { Text } from 'components/Text'
import styled from 'styled-components'

const StyledNotFound = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px);
  justify-content: center;
`

const NotSupport = () => {
  return (
    <StyledNotFound>
      <Text mb="16px">Unavailable for legal reasons</Text>
    </StyledNotFound>
  )
}

NotSupport.pure = true

export default NotSupport
