import { useCallback, useState, useRef, useEffect } from 'react'
import { Currency, Token } from 'libraries/swap-sdk'
import { ModalContainer, ModalHeader, ModalTitle, ModalBackButton, ModalBody, ModalCloseButton, InjectedModalProps, MODAL_SWIPE_TO_CLOSE_VELOCITY } from 'widgets/Modal'
import { ImportList } from 'widgets/ImportList'
import { useMatchBreakpoints } from 'contexts'
import { Text } from 'components/Text'
import styled from 'styled-components'
import { useListState } from 'state/lists/lists'
import { useAllLists } from 'state/lists/hooks'
import usePreviousValue from 'hooks/usePreviousValue'
import { TokenList } from 'libraries/token-lists'
import { enableList, removeList, useFetchListCallback } from 'libraries/token-lists/react'
import CurrencySearch from './CurrencySearch'
import ImportToken from './ImportToken'
import Manage from './Manage'
import { CurrencyModalView } from './types'

const StyledModalContainer = styled(ModalContainer)`
  width: 100%;
  min-width: 320px;
  max-width: 420px !important;
  min-height: 500px;
`

const StyledModalBody = styled(ModalBody)`
  padding: 10px 20px 20px 20px;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`

export interface CurrencySearchModalProps extends InjectedModalProps {
  selectedCurrency?: Currency | null
  onCurrencySelect?: (currency: Currency) => void
  otherSelectedCurrency?: Currency | null
  showCommonBases?: boolean
  commonBasesType?: string
  showSearchInput?: boolean
  tokensToShow?: Token[]
}

export default function CurrencySearchModal({
  onDismiss = () => null,
  onCurrencySelect,
  selectedCurrency,
  otherSelectedCurrency,
  showCommonBases = true,
  commonBasesType,
  showSearchInput,
  tokensToShow,
}: CurrencySearchModalProps) {
  const [modalView, setModalView] = useState<CurrencyModalView>(CurrencyModalView.search)

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      onDismiss?.()
      onCurrencySelect?.(currency)
    },
    [onDismiss, onCurrencySelect],
  )

  // for token import view
  const prevView = usePreviousValue(modalView)

  // used for import token flow
  const [importToken, setImportToken] = useState<Token | undefined>()

  // used for import list
  const [importList, setImportList] = useState<TokenList | undefined>()
  const [listURL, setListUrl] = useState<string | undefined>()

  const [, dispatch] = useListState()
  const lists = useAllLists()
  const adding = Boolean(listURL && lists[listURL]?.loadingRequestId)

  const fetchList = useFetchListCallback(dispatch)

  const [addError, setAddError] = useState<string | null>(null)

  const handleAddList = useCallback(() => {
    if (adding || !listURL) return
    setAddError(null)
    fetchList(listURL)
      .then(() => {
        dispatch(enableList(listURL))
        setModalView(CurrencyModalView.manage)
      })
      .catch((error) => {
        setAddError(error.message)
        dispatch(removeList(listURL))
      })
  }, [adding, dispatch, fetchList, listURL])

  const config = {
    [CurrencyModalView.search]: { title: 'Select a Token', onBack: undefined },
    [CurrencyModalView.manage]: { title: 'Manage', onBack: () => setModalView(CurrencyModalView.search) },
    [CurrencyModalView.importToken]: {
      title: 'Import Tokens',
      onBack: () =>
        setModalView(prevView && prevView !== CurrencyModalView.importToken ? prevView : CurrencyModalView.search),
    },
    [CurrencyModalView.importList]: { title: 'Import List', onBack: () => setModalView(CurrencyModalView.search) },
  }
  const { isMobile } = useMatchBreakpoints()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<number | undefined>(undefined)
  useEffect(() => {
    if (!wrapperRef.current) return
    setHeight(wrapperRef.current.offsetHeight - 330)
  }, [])

  return (
    <StyledModalContainer
      drag={isMobile ? 'y' : false}
      dragConstraints={{ top: 0, bottom: 600 }}
      dragElastic={{ top: 0 }}
      dragSnapToOrigin
      onDragStart={() => {
        if (wrapperRef.current) wrapperRef.current.style.animation = 'none'
      }}
      // @ts-ignore
      onDragEnd={(e, info) => {
        if (info.velocity.y > MODAL_SWIPE_TO_CLOSE_VELOCITY && onDismiss) onDismiss()
      }}
      ref={wrapperRef}
    >
      <ModalHeader>
        <ModalTitle>
          {config[modalView].onBack && <ModalBackButton onBack={config[modalView].onBack} />}
          <Text>{config[modalView].title}</Text>
        </ModalTitle>
        <ModalCloseButton onDismiss={onDismiss} />
      </ModalHeader>
      <StyledModalBody>
        {modalView === CurrencyModalView.search ? (
          <CurrencySearch
            onCurrencySelect={handleCurrencySelect}
            selectedCurrency={selectedCurrency}
            otherSelectedCurrency={otherSelectedCurrency}
            showCommonBases={showCommonBases}
            commonBasesType={commonBasesType}
            showSearchInput={showSearchInput}
            showImportView={() => setModalView(CurrencyModalView.importToken)}
            setImportToken={setImportToken}
            height={height}
            tokensToShow={tokensToShow}
          />
        ) : modalView === CurrencyModalView.importToken && importToken ? (
          <ImportToken tokens={[importToken]} handleCurrencySelect={handleCurrencySelect} />
        ) : modalView === CurrencyModalView.importList && importList && listURL ? (
          <ImportList
            onAddList={handleAddList}
            addError={addError}
            listURL={listURL}
            listLogoURI={importList?.logoURI}
            listName={importList?.name}
            listTokenLength={importList?.tokens.length}
          />
        ) : modalView === CurrencyModalView.manage ? (
          <Manage
            setModalView={setModalView}
            setImportToken={setImportToken}
            setImportList={setImportList}
            setListUrl={setListUrl}
          />
        ) : (
          ''
        )}
      </StyledModalBody>
    </StyledModalContainer>
  )
}
