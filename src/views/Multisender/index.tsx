import { useState } from 'react'
import styled from 'styled-components'
import { Currency } from 'libraries/swap-sdk'
import { Card, Flex } from 'components'
import useNativeCurrency from 'hooks/useNativeCurrency'
import Page from 'components/Layout/Page'
import { CryptoFormView, DataType } from './types'
import { InputForm } from './components/InputForm'
import { QuoteForm } from './components/QuoteForm'

export const StyledAppBody = styled(Card)`
  border-radius: 8px;
  max-width: 1080px;
  width: 100%;
  z-index: 1;
`
const MultisenderPage: React.FC<React.PropsWithChildren> = () => {
  const [modalView, setModalView] = useState<CryptoFormView>(CryptoFormView.Input)

  const [ data, setData ] = useState<DataType[]>([])

  const [ tag, setTag ] = useState<string>("")
  
  const native = useNativeCurrency()

  const [currency, setCurrency] = useState<Currency | null>(() => native)

  return (
    <Page>
      <Flex justifyContent="center" mt="40px">
        <StyledAppBody mb="24px">
          {modalView === CryptoFormView.Input ? (
            <InputForm 
              setModalView={setModalView} 
              data={data} 
              setData={setData} 
              tag={tag} 
              setTag={setTag} 
              currency={currency} 
              setCurrency={setCurrency} 
            />
          ) : (
            <QuoteForm setModalView={setModalView} data={data} tag={tag} currency={currency} />
          )}
        </StyledAppBody>
      </Flex>
    </Page>
  )
}

export default MultisenderPage
