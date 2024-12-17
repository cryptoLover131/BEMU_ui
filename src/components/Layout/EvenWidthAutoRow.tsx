import styled from 'styled-components'
import { AutoRow } from '../Row'

export const EvenWidthAutoRow = styled(AutoRow)`
  & > * {
    flex: 1;
  }
`
