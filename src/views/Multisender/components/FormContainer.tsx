import { PropsWithChildren, memo } from 'react'
import { Column, Flex } from 'components'
import styled from 'styled-components'

export const Wrapper = styled(Flex)`
  position: relative;
  flex-direction: column;
  justify-content: space-between;
`

export const FormContainer = memo(function FormContainer({ children }: PropsWithChildren) {
  return (
    <Wrapper>
      <Column>
        {children}
      </Column>
    </Wrapper>
  )
})
