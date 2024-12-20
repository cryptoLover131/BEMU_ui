import { Currency, CurrencyAmount, NATIVE, Percent } from 'libraries/swap-sdk'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import useIsMounted from 'hooks/useIsMounted'
import useWrapCallback, { WrapType } from 'hooks/useWrapCallback'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { useCurrency } from 'hooks/Tokens'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { currencyId } from 'utils/currencyId'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import replaceBrowserHistory from 'utils/replaceBrowserHistory'
import { useSwapActionHandlers } from 'state/swap/useSwapActionHandlers'
import { Field } from 'state/swap/actions'
import { combinedTokenMapFromOfficialsUrlsAtom } from 'state/lists/hooks'
import { useDefaultsFromURLSearch, useDerivedSwapInfo, useSwapState } from 'state/swap/hooks'
import { useUserSlippageTolerance } from 'state/user/hooks'
import Page from 'components/Layout/Page'
import { Box, Flex } from 'components/Box'
import { AppBody } from 'components/App'
import { AutoColumn } from 'components/Column'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import { AutoRow } from 'components/Layout/Row'
import { ArrowDownIcon, ArrowUpDownIcon, IconButton, NextLinkFromReactRouter, OpenNewIcon, Text } from 'components'
import { RowBetween } from 'components/Row'
import { CommonBasesType } from 'components/SearchModal/types'
import { useAtomValue } from 'jotai'
import { iconDownClass, iconUpDownClass, switchButtonClass } from 'theme/css/SwapWidget.css'
import { useTradeInfo } from './hooks/useTradeInfo'
import AdvancedSwapDetailsDropdown from './components/AdvancedSwapDetailsDropdown'
import { ArbitrumBridgeBox, Wrapper } from './components/styleds'
import CurrencyInputHeader from './components/CurrencyInputHeader'
import SwapCommitButton from './components/SwapCommitButton'

export default function Swap() {
  const router = useRouter()
  const tokenMap = useAtomValue(combinedTokenMapFromOfficialsUrlsAtom)
  const loadedUrlParams = useDefaultsFromURLSearch()
  const { onSwitchTokens, onCurrencySelection, onUserInput } = useSwapActionHandlers()

  const { chainId, account } = useAccountActiveChain()

  const [ allowedSlippage ] = useUserSlippageTolerance()

  const {
    independentField,
    typedValue,
    recipient,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()
  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)

  const currencies: { [field in Field]?: Currency } = useMemo(
    () => ({
      [Field.INPUT]: inputCurrency ?? undefined,
      [Field.OUTPUT]: outputCurrency ?? undefined,
    }),
    [inputCurrency, outputCurrency],
  )

  const handleOutputSelect = useCallback(
    (newCurrencyOutput: Currency) => {
      onCurrencySelection(Field.OUTPUT, newCurrencyOutput)

      const newCurrencyOutputId = currencyId(newCurrencyOutput)
      if (newCurrencyOutputId === inputCurrencyId) {
        replaceBrowserHistory('inputCurrency', outputCurrencyId)
      }
      replaceBrowserHistory('outputCurrency', newCurrencyOutputId)
    },
    [inputCurrencyId, outputCurrencyId, onCurrencySelection],
  )

  const handleInputSelect = useCallback(
    (newCurrencyInput) => {
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, newCurrencyInput)

      const newCurrencyInputId = currencyId(newCurrencyInput)
      if (newCurrencyInputId === outputCurrencyId) {
        replaceBrowserHistory('outputCurrency', inputCurrencyId)
      }
      replaceBrowserHistory('inputCurrency', newCurrencyInputId)
    },
    [inputCurrencyId, outputCurrencyId, onCurrencySelection],
  )

  const { trade, parsedAmount, currencyBalances, inputError: swapInputError } = useDerivedSwapInfo(
    independentField,
    typedValue,
    inputCurrency ?? undefined,
    outputCurrency ?? undefined,
    recipient ?? undefined,
  )

  const tradeInfo = useTradeInfo({
    trade,
    allowedSlippage,
    chainId,
    swapInputError
  })

  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue)
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE

  const parsedAmounts = showWrap
    ? {
        [Field.INPUT]: parsedAmount,
        [Field.OUTPUT]: parsedAmount,
      }
    : {
        [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : tradeInfo?.inputAmount,
        [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : tradeInfo?.outputAmount,
      }

  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value)
    },
    [onUserInput],
  )
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value)
    },
    [onUserInput],
  )

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  const amountToApprove = tradeInfo?.slippageAdjustedAmounts[Field.INPUT]
  // check whether the user has approved the router on the input token
  const {approvalState, approveCallback} = useApproveCallback(amountToApprove, tradeInfo?.routerAddress)

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approvalState === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approvalState, approvalSubmitted])

  const maxAmountInput: CurrencyAmount<Currency> | undefined = maxAmountSpend(currencyBalances[Field.INPUT])

  const handleMaxInput = useCallback(() => {
    if (maxAmountInput) {
      onUserInput(Field.INPUT, maxAmountInput.toExact())
    }
  }, [maxAmountInput, onUserInput])

  const handlePercentInput = useCallback(
    (percent) => {
      if (maxAmountInput) {
        onUserInput(Field.INPUT, maxAmountInput.multiply(new Percent(percent, 100)).toExact())
      }
    },
    [maxAmountInput, onUserInput],
  )

  useEffect(() => {
    // Reset approval submit state after switch between old router and new router
    setApprovalSubmitted(false)
  }, [tradeInfo])

  const isMounted = useIsMounted();

  return (
    <Page className='swigy-cs1'>
      <Flex className='swigy-cs' justifyContent="center" mt="40px">        
      {account && 
        <AppBody onClick={(e) => e.stopPropagation()}>
          {/* <CurrencyInputHeader
            title='Swap'
          /> */}
          <Wrapper id="swap-page" position="relative">
            <CurrencyInputPanel
              label={independentField === Field.OUTPUT && !showWrap && tradeInfo ? 'From (estimated)' : 'From'}
              value={formattedAmounts[Field.INPUT]}
              showMaxButton
              maxAmount={maxAmountInput}
              showQuickInputButton
              currency={currencies[Field.INPUT]}
              onUserInput={handleTypeInput}
              onPercentInput={handlePercentInput}
              onMax={handleMaxInput}
              onCurrencySelect={handleInputSelect}
              otherCurrency={currencies[Field.OUTPUT]}
              id="swap-currency-input"
              showCommonBases
              showBUSD={((inputCurrencyId ? !!tokenMap[chainId]?.[inputCurrencyId] : false) || inputCurrencyId === NATIVE[chainId]?.symbol)}
              commonBasesType={CommonBasesType.SWAP_LIMITORDER}
            />

              <AutoRow justify='center' my="-22px" mx="auto" zIndex="2">
                <IconButton 
                  className={switchButtonClass} 
                  variant="text"
                  scale="md"
                  onClick={() => {
                    setApprovalSubmitted(false) // reset 2 step UI for approvals
                    onSwitchTokens()
                    replaceBrowserHistory('inputCurrency', outputCurrencyId)
                    replaceBrowserHistory('outputCurrency', inputCurrencyId)
                  }}
                >
                  <ArrowDownIcon className={iconDownClass} color="primary" />
                  <ArrowUpDownIcon className={iconUpDownClass} color="primary" />
                </IconButton>
              </AutoRow>
            <CurrencyInputPanel
              value={formattedAmounts[Field.OUTPUT]}
              onUserInput={handleTypeOutput}
              label={independentField === Field.INPUT && !showWrap && tradeInfo ? 'To (estimated)' : 'To'}
              showMaxButton={false}
              currency={currencies[Field.OUTPUT]}
              onCurrencySelect={handleOutputSelect}
              otherCurrency={currencies[Field.INPUT]}
              id="swap-currency-output"
              showCommonBases
              showBUSD={((outputCurrencyId ? !!tokenMap[chainId]?.[outputCurrencyId] : false) || outputCurrencyId === NATIVE[chainId]?.symbol)}
              commonBasesType={CommonBasesType.SWAP_LIMITORDER}
            />

            <Box mt="0.5rem">
              <SwapCommitButton
                account={account ?? undefined}
                showWrap={showWrap}
                wrapInputError={wrapInputError}
                onWrap={onWrap}
                wrapType={wrapType}
                parsedIndepentFieldAmount={parsedAmounts[independentField]}
                approval={approvalState}
                approveCallback={approveCallback}
                approvalSubmitted={approvalSubmitted}
                currencies={currencies}
                trade={trade}
                swapInputError={tradeInfo?.inputError ?? swapInputError}
                currencyBalances={currencyBalances}
                recipient={recipient}
                allowedSlippage={allowedSlippage}
                onUserInput={onUserInput}
              />
            </Box>

            {!showWrap && tradeInfo && (
                <AutoColumn gap="sm" pt="8px" px="16px">
                  <RowBetween alignItems="center">
                    <Text fontSize="14px">
                      Max.Slippage
                    </Text>
                    {isMounted && (
                      <Text fontSize="14px">
                        {allowedSlippage / 100}%
                      </Text>
                    )}
                  </RowBetween>
                </AutoColumn>
              )}
              {!showWrap &&
                tradeInfo && (
                  <AdvancedSwapDetailsDropdown
                    pairs={tradeInfo.route.pairs}
                    path={tradeInfo.route.path}
                    priceImpactWithoutFee={tradeInfo.priceImpactWithoutFee}
                    realizedLPFee={tradeInfo.realizedLPFee ?? undefined}
                    slippageAdjustedAmounts={tradeInfo.slippageAdjustedAmounts}
                    inputAmount={tradeInfo.inputAmount}
                    outputAmount={tradeInfo.outputAmount}
                    tradeType={tradeInfo.tradeType}
                  />
              )}
          </Wrapper>
        </AppBody>}
      </Flex>
    </Page>
  )
}
