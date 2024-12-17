import styled from 'styled-components'
import { Flex, Card } from 'components'
import Page from 'components/Layout/Page'
import HistoryForm from './components/HistoryForm'

export const StyledAppBody = styled(Card)`
  border-radius: 8px;
  max-width: 1080px;
  width: 100%;
  z-index: 1;
`
const History: React.FC<React.PropsWithChildren> = () => {
  return (
    <Page>
      <Flex justifyContent="center" mt="40px">
        <StyledAppBody mb="24px">
          <HistoryForm />
        </StyledAppBody>
      </Flex>
    </Page>
  )
}

export default History
