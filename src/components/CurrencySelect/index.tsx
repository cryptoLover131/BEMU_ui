import styled from 'styled-components'
import { ArrowDropDownIcon, Box, Button, Text, Flex, BoxProps } from 'components'
import { useModal } from 'widgets/Modal'
import CurrencySearchModal, { CurrencySearchModalProps } from 'components/SearchModal/CurrencySearchModal'
import { CurrencyLogo } from '../Logo'

const DropDownHeader = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 16px;
  box-shadow: ${({ theme }) => theme.shadows.inset};
  border: 1px solid ${({ theme }) => theme.colors.inputSecondary};
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.input};
  transition: border-radius 0.15s;
`

const DropDownContainer = styled(Button)`
  cursor: pointer;
  width: 100%;
  position: relative;
  background: ${({ theme }) => theme.colors.input};
  border-radius: 8px;
  height: 40px;
  min-width: 136px;
  user-select: none;
  z-index: 20;

  .down-icon {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
  }
`

interface CurrencySelectProps extends CurrencySearchModalProps, BoxProps {}

export const CurrencySelect = ({
  onCurrencySelect,
  selectedCurrency,
  otherSelectedCurrency,
  showCommonBases,
  commonBasesType,
  ...props
}: CurrencySelectProps) => {

  const [onPresentCurrencyModal] = useModal(
    <CurrencySearchModal
      onCurrencySelect={onCurrencySelect}
      selectedCurrency={selectedCurrency}
      otherSelectedCurrency={otherSelectedCurrency}
      showCommonBases={showCommonBases}
      commonBasesType={commonBasesType}
    />,
  )

  return (
    <Box width="100%" {...props}>
      <DropDownContainer p={0} onClick={onPresentCurrencyModal}>
        <DropDownHeader>
          <Text id="pair" color={!selectedCurrency ? 'text' : undefined}>
            {!selectedCurrency ? (
              <>Select</>
            ) : (
              <Flex alignItems="center" justifyContent="space-between">
                <CurrencyLogo currency={selectedCurrency} size="24px" style={{ marginRight: '8px' }} />
                <Text id="pair">
                  {selectedCurrency && selectedCurrency.symbol && selectedCurrency.symbol.length > 20
                    ? `${selectedCurrency.symbol.slice(0, 4)}...${selectedCurrency.symbol.slice(
                        selectedCurrency.symbol.length - 5,
                        selectedCurrency.symbol.length,
                      )}`
                    : selectedCurrency?.symbol}
                </Text>
              </Flex>
            )}
          </Text>
        </DropDownHeader>
        <ArrowDropDownIcon color="text" className="down-icon" />
      </DropDownContainer>
    </Box>
  )
}
