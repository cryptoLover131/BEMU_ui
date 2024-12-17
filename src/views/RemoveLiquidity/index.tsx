import { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { Currency, Percent, WNATIVE } from 'libraries/swap-sdk'
import {
  Button,
  Text,
  AddIcon,
  ArrowDownIcon,
  CardBody,
  Slider,
  Box,
  Flex,
  Card,
  NextLinkFromReactRouter,
  OpenNewIcon,
} from 'components'
import { useModal } from 'widgets/Modal'
import { useMatchBreakpoints, useToast } from 'contexts'
import useDebouncedChangeHandler from 'hooks/useDebouncedChangeHandler'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { CommitButton } from 'components/CommitButton'
import { ROUTER_ADDRESS } from 'config/constants/exchange'
import { transactionErrorToUserReadableMessage } from 'utils/transactionErrorToUserReadableMessage'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { AutoColumn, ColumnCenter } from 'components/Layout/Column'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import { MinimalPositionCard } from 'components/PositionCard'
import { AppHeader, AppBody } from 'components/App'
import { RowBetween } from 'components/Layout/Row'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { CommonBasesType } from 'components/SearchModal/types'
import { CurrencyLogo } from 'components/Logo'
import Page from 'components/Layout/Page'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { usePairContract } from 'hooks/useContracts'
import { useTransactionDeadline } from 'hooks/useTransactionDeadline'
import { useTransactionAdder } from 'state/transactions/hooks'
import { calculateGasMargin } from 'utils'
import { calculateSlippageAmount, useRouterContract } from 'utils/exchange'
import { currencyId } from 'utils/currencyId'
import { useApproveCallback, ApprovalState } from 'hooks/useApproveCallback'
import Dots from 'components/Loader/Dots'
import { useBurnActionHandlers, useDerivedBurnInfo, useBurnState } from 'state/burn/hooks'
import { Field } from 'state/burn/actions'
import { useGasPrice, useUserSlippageTolerance } from 'state/user/hooks'
import { ArbitrumBridgeBox } from 'views/Swap/components/styleds'
import { InternalLink } from './components/InternalLink'
import ConfirmLiquidityModal from '../Swap/components/ConfirmRemoveLiquidityModal'

const BorderCard = styled.div`
  border: solid 1px ${({ theme }) => theme.colors.cardBorder};
  border-radius: 8px;
  padding: 16px;
`

export default function RemoveLiquidity({ currencyA, currencyB, currencyIdA, currencyIdB }) {
  const router = useRouter()
  const native = useNativeCurrency()
  const { isMobile } = useMatchBreakpoints()
  const { account, chainId } = useAccountActiveChain()
  const { isWrongNetwork } = useActiveWeb3React()
  const { toastError } = useToast()
  const [tokenA, tokenB] = useMemo(() => [currencyA?.wrapped, currencyB?.wrapped], [currencyA, currencyB])

  const gasPrice = useGasPrice()

  // burn state
  const { independentField, typedValue } = useBurnState()
  const [removalCheckedA, ] = useState(true)
  const [removalCheckedB, ] = useState(true)
  const { pair, parsedAmounts, error } = useDerivedBurnInfo(
    currencyA ?? undefined,
    currencyB ?? undefined,
    removalCheckedA,
    removalCheckedB
  )
  const { onUserInput: _onUserInput } = useBurnActionHandlers()
  const isValid = !error

  // modal and loading
  const [showDetailed, ] = useState<boolean>(false)
  const [{ attemptingTxn, liquidityErrorMessage, txHash }, setLiquidityState] = useState<{
    attemptingTxn: boolean
    liquidityErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    attemptingTxn: false,
    liquidityErrorMessage: undefined,
    txHash: undefined,
  })

  // txn values
  const deadline = useTransactionDeadline()
  const [allowedSlippage] = useUserSlippageTolerance()

  const formattedAmounts = {
    [Field.LIQUIDITY_PERCENT]: parsedAmounts[Field.LIQUIDITY_PERCENT].equalTo('0')
      ? '0'
      : parsedAmounts[Field.LIQUIDITY_PERCENT].lessThan(new Percent('1', '100'))
      ? '<1'
      : parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0),
    [Field.LIQUIDITY]:
      independentField === Field.LIQUIDITY ? typedValue : parsedAmounts[Field.LIQUIDITY]?.toSignificant(6) ?? '',
    [Field.CURRENCY_A]:
      independentField === Field.CURRENCY_A ? typedValue : parsedAmounts[Field.CURRENCY_A]?.toSignificant(6) ?? '',
    [Field.CURRENCY_B]:
      independentField === Field.CURRENCY_B ? typedValue : parsedAmounts[Field.CURRENCY_B]?.toSignificant(6) ?? '',
  }

  // pair contract
  const pairContractRead = usePairContract(pair?.liquidityToken?.address)

  // allowance handling
  const [signatureData, setSignatureData] = useState<{ v: number; r: string; s: string; deadline: number } | null>(null)
  const { approvalState: approval, approveCallback } = useApproveCallback(
    parsedAmounts[Field.LIQUIDITY],
    ROUTER_ADDRESS[chainId],
  )

  async function onAttemptToApprove() {
    if (!pairContractRead || !pair || !deadline) throw new Error('missing dependencies')
    const liquidityAmount = parsedAmounts[Field.LIQUIDITY]
    if (!liquidityAmount) {
      toastError('Error', 'Missing liquidity amount')
      throw new Error('missing liquidity amount')
    }

    approveCallback()
  }

  // wrapped onUserInput to clear signatures
  const onUserInput = useCallback(
    (field: Field, value: string) => {
      setSignatureData(null)
      return _onUserInput(field, value)
    },
    [_onUserInput],
  )

  const onLiquidityInput = useCallback((value: string): void => onUserInput(Field.LIQUIDITY, value), [onUserInput])
  const onCurrencyAInput = useCallback((value: string): void => onUserInput(Field.CURRENCY_A, value), [onUserInput])
  const onCurrencyBInput = useCallback((value: string): void => onUserInput(Field.CURRENCY_B, value), [onUserInput])

  // tx sending
  const addTransaction = useTransactionAdder()

  const routerContract = useRouterContract()

  async function onRemove() {
    if (!chainId || !account || !deadline || !routerContract) throw new Error('missing dependencies')
    const { [Field.CURRENCY_A]: currencyAmountA, [Field.CURRENCY_B]: currencyAmountB } = parsedAmounts
    if (!currencyAmountA || !currencyAmountB) {
      toastError('Error', 'Missing currency amounts')
      throw new Error('missing currency amounts')
    }

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(currencyAmountA, allowedSlippage)[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(currencyAmountB, allowedSlippage)[0],
    }

    if (!currencyA || !currencyB) {
      toastError('Error', 'Missing tokens')
      throw new Error('missing tokens')
    }
    const liquidityAmount = parsedAmounts[Field.LIQUIDITY]
    if (!liquidityAmount) {
      toastError('Error', 'Missing liquidity amount')
      throw new Error('missing liquidity amount')
    }

    const currencyBIsNative = currencyB?.isNative
    const oneCurrencyIsNative = currencyA?.isNative || currencyBIsNative

    if (!tokenA || !tokenB) {
      toastError('Error', 'Could not wrap')
      throw new Error('could not wrap')
    }

    let methodNames: string[]
    let args: Array<string | string[] | number | boolean>
    // we have approval, use normal remove liquidity
    if (approval === ApprovalState.APPROVED) {
      // removeLiquidityETH
      if (oneCurrencyIsNative) {
        methodNames = ['removeLiquidityETH', 'removeLiquidityETHSupportingFeeOnTransferTokens']
        args = [
          currencyBIsNative ? tokenA.address : tokenB.address,
          liquidityAmount.quotient.toString(),
          amountsMin[currencyBIsNative ? Field.CURRENCY_A : Field.CURRENCY_B].toString(),
          amountsMin[currencyBIsNative ? Field.CURRENCY_B : Field.CURRENCY_A].toString(),
          account,
          Number(deadline[0]).toString(),
        ]
      }
      // removeLiquidity
      else {
        methodNames = ['removeLiquidity']
        args = [
          tokenA.address,
          tokenB.address,
          liquidityAmount.quotient.toString(),
          amountsMin[Field.CURRENCY_A].toString(),
          amountsMin[Field.CURRENCY_B].toString(),
          account,
          Number(deadline[0]).toString(),
        ]
      }
    }
    // we have a signature, use permit versions of remove liquidity
    else if (signatureData !== null) {
      // removeLiquidityETHWithPermit
      if (oneCurrencyIsNative) {
        methodNames = ['removeLiquidityETHWithPermit', 'removeLiquidityETHWithPermitSupportingFeeOnTransferTokens']
        args = [
          currencyBIsNative ? tokenA.address : tokenB.address,
          liquidityAmount.quotient.toString(),
          amountsMin[currencyBIsNative ? Field.CURRENCY_A : Field.CURRENCY_B].toString(),
          amountsMin[currencyBIsNative ? Field.CURRENCY_B : Field.CURRENCY_A].toString(),
          account,
          signatureData.deadline,
          false,
          signatureData.v,
          signatureData.r,
          signatureData.s,
        ]
      }
      // removeLiquidityETHWithPermit
      else {
        methodNames = ['removeLiquidityWithPermit']
        args = [
          tokenA.address,
          tokenB.address,
          liquidityAmount.quotient.toString(),
          amountsMin[Field.CURRENCY_A].toString(),
          amountsMin[Field.CURRENCY_B].toString(),
          account,
          signatureData.deadline,
          false,
          signatureData.v,
          signatureData.r,
          signatureData.s,
        ]
      }
    } else {
      toastError('Error', 'Attempting to confirm without approval or a signature')
      throw new Error('Attempting to confirm without approval or a signature')
    }

    let methodSafeGasEstimate: { methodName: string; safeGasEstimate: bigint } | undefined
    for (let i = 0; i < methodNames.length; i++) {
      let safeGasEstimate
      try {
        // eslint-disable-next-line no-await-in-loop
        safeGasEstimate = calculateGasMargin(await routerContract.estimateGas[methodNames[i]](args, { account }))
      } catch (e) {
        console.error(`estimateGas failed`, methodNames[i], args, e)
      }

      if (typeof safeGasEstimate === 'bigint') {
        methodSafeGasEstimate = { methodName: methodNames[i], safeGasEstimate }
        break
      }
    }

    // all estimations failed...
    if (!methodSafeGasEstimate) {
      toastError('Error', 'This transaction would fail')
    } else {
      const { methodName, safeGasEstimate } = methodSafeGasEstimate

      setLiquidityState({ attemptingTxn: true, liquidityErrorMessage: undefined, txHash: undefined })
      await routerContract.write[methodName](args, {
        gas: safeGasEstimate,
        gasPrice,
      })
        .then((response: `0x${string}`) => {
          setLiquidityState({ attemptingTxn: false, liquidityErrorMessage: undefined, txHash: response })
          const amountA = parsedAmounts[Field.CURRENCY_A]?.toSignificant(3)
          const amountB = parsedAmounts[Field.CURRENCY_B]?.toSignificant(3)
          addTransaction({ hash: response }, {
            summary: `Remove ${amountA} ${currencyA?.symbol} and ${amountB} ${currencyB?.symbol}`,
            translatableSummary: {
              text: 'Remove %amountA% %symbolA% and %amountB% %symbolB%',
              data: { amountA: amountA ?? "", symbolA: currencyA?.symbol, amountB: amountB ?? "", symbolB: currencyB?.symbol },
            },
            type: 'remove-liquidity',
          })
        })
        .catch((err) => {
          if (err && err.code !== 4001) {
            console.error(`Remove Liquidity failed`, err, args)
          }
          setLiquidityState({
            attemptingTxn: false,
            liquidityErrorMessage:
              err && err?.code !== 4001
                ? `Remove liquidity failed: ${transactionErrorToUserReadableMessage(err)}`
                : undefined,
            txHash: undefined,
          })
        })
    }
  }

  const pendingText = `Removing ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(6) ?? ''} ${currencyA?.symbol ?? ''} and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(6) ?? ''} ${currencyB?.symbol ?? ''}`

  const liquidityPercentChangeCallback = useCallback(
    (value: number) => {
      onUserInput(Field.LIQUIDITY_PERCENT, value.toString())
    },
    [onUserInput],
  )

  const oneCurrencyIsNative = currencyA?.isNative || currencyB?.isNative
  const oneCurrencyIsWNative = Boolean(
    chainId &&
      ((currencyA && WNATIVE[chainId]?.equals(currencyA)) || (currencyB && WNATIVE[chainId]?.equals(currencyB))),
  )

  const handleSelectCurrencyA = useCallback(
    (currency: Currency) => {
      if (currencyIdB && currencyId(currency) === currencyIdB) {
        router.replace(`/remove/${currencyId(currency)}/${currencyIdA}`, undefined, { shallow: true })
      } else {
        router.replace(`/remove/${currencyId(currency)}/${currencyIdB}`, undefined, { shallow: true })
      }
    },
    [currencyIdA, currencyIdB, router],
  )
  const handleSelectCurrencyB = useCallback(
    (currency: Currency) => {
      if (currencyIdA && currencyId(currency) === currencyIdA) {
        router.replace(`/remove/${currencyIdB}/${currencyId(currency)}`, undefined, { shallow: true })
      } else {
        router.replace(`/remove/${currencyIdA}/${currencyId(currency)}`, undefined, { shallow: true })
      }
    },
    [currencyIdA, currencyIdB, router],
  )

  const handleDismissConfirmation = useCallback(() => {
    setSignatureData(null) // important that we clear signature data to avoid bad sigs
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.LIQUIDITY_PERCENT, '0')
    }
  }, [onUserInput, txHash])

  const [innerLiquidityPercentage, setInnerLiquidityPercentage] = useDebouncedChangeHandler(
    Number.parseInt(parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0)),
    liquidityPercentChangeCallback,
  )

  const handleChangePercent = useCallback(
    (value) => setInnerLiquidityPercentage(Math.ceil(value)),
    [setInnerLiquidityPercentage],
  )

  const [onPresentRemoveLiquidity] = useModal(
    <ConfirmLiquidityModal
      title='You will receive'
      customOnDismiss={handleDismissConfirmation}
      attemptingTxn={attemptingTxn}
      hash={txHash || ''}
      allowedSlippage={allowedSlippage}
      onRemove={onRemove}
      pendingText={pendingText}
      approval={approval}
      signatureData={signatureData}
      tokenA={tokenA}
      tokenB={tokenB}
      liquidityErrorMessage={liquidityErrorMessage}
      parsedAmounts={parsedAmounts}
      currencyA={currencyA}
      currencyB={currencyB}
    />,
    true,
    true,
    'removeLiquidityModal',
  )

  return (
    <Page>
      <Flex justifyContent="center" mt="40px">
        <AppBody>
          <AppHeader
            backTo="/pool"
            title={`Remove ${currencyA?.symbol ?? ''}-${currencyB?.symbol ?? ''} liquidity`}
          />
          <AutoColumn style={{marginTop: "10px"}}>
            {!showDetailed && (
              <BorderCard style={{ padding: isMobile ? '8px' : '16px', marginBottom: '12px' }}>
                <Flex alignItems="center" justifyContent="space-between">
                  <Slider
                    name="lp-amount"
                    min={0}
                    max={100}
                    value={innerLiquidityPercentage}
                    onValueChanged={handleChangePercent}
                    width="100%"
                  />
                  <Box width="60px">
                    <Text fontSize="20px" style={{ lineHeight: 1 }} mb="4px" textAlign="right">
                      {formattedAmounts[Field.LIQUIDITY_PERCENT]}%
                    </Text>
                  </Box>
                </Flex>
                <Flex flexWrap="wrap" justifyContent="right">
                  <Button 
                    variant="text" 
                    scale="sm" 
                    onClick={() => onUserInput(Field.LIQUIDITY_PERCENT, '25')}
                    height="24px"
                  >
                    25%
                  </Button>
                  <Button 
                    variant="text" 
                    scale="sm" 
                    onClick={() => onUserInput(Field.LIQUIDITY_PERCENT, '50')}
                    height="24px"
                  >
                    50%
                  </Button>
                  <Button 
                    variant="text" 
                    scale="sm" 
                    onClick={() => onUserInput(Field.LIQUIDITY_PERCENT, '75')}
                    height="24px"
                  >
                    75%
                  </Button>
                  <Button 
                    variant="text" 
                    scale="sm" 
                    onClick={() => onUserInput(Field.LIQUIDITY_PERCENT, '100')}
                    height="24px"
                  >
                    Max
                  </Button>
                </Flex>
              </BorderCard>
            )}
          </AutoColumn>
          {!showDetailed && (
            <>
              {/* <ColumnCenter>
                <ArrowDownIcon color="textSubtle" width="24px" my="16px" />
              </ColumnCenter> */}
              <AutoColumn>
                <Text color="secondary" fontSize="12px" textTransform="uppercase">
                  Receive
                </Text>
                <Card>
                  <CardBody p="8px">
                    <Flex justifyContent="space-between" mb="8px" as="label" alignItems="center">
                      <Flex alignItems="center">
                        <CurrencyLogo currency={currencyA} />
                        <Text small color="textSubtle" id="remove-liquidity-tokena-symbol" ml="4px">
                          {currencyA?.symbol}
                        </Text>
                      </Flex>
                      <Flex>
                        <Text small>
                          {formattedAmounts[Field.CURRENCY_A] || '0'}
                        </Text>
                        <Text small ml="4px">
                          (50%)
                        </Text>
                      </Flex>
                    </Flex>
                    <Flex justifyContent="space-between" as="label" alignItems="center">
                      <Flex alignItems="center">
                        <CurrencyLogo currency={currencyB} />
                        <Text small color="textSubtle" id="remove-liquidity-tokenb-symbol" ml="4px">
                          {currencyB?.symbol}
                        </Text>
                      </Flex>
                      <Flex>
                        <Text small>
                          {formattedAmounts[Field.CURRENCY_B] || '0'}
                        </Text>
                        <Text small ml="4px">
                          (50%)
                        </Text>
                      </Flex>
                    </Flex>
                    {chainId && (oneCurrencyIsWNative || oneCurrencyIsNative) ? (
                      <RowBetween style={{ justifyContent: 'flex-end', fontSize: '14px' }}>
                        {oneCurrencyIsNative ? (
                          <InternalLink
                            href={`/remove/${currencyA?.isNative ? WNATIVE[chainId]?.address : currencyIdA}/${
                              currencyB?.isNative ? WNATIVE[chainId]?.address : currencyIdB
                            }`}
                          >
                            Receive {WNATIVE[chainId]?.symbol}
                          </InternalLink>
                        ) : oneCurrencyIsWNative ? (
                          <InternalLink
                            href={`/remove/${
                              currencyA && currencyA.equals(WNATIVE[chainId]) ? native?.symbol : currencyIdA
                            }/${currencyB && currencyB.equals(WNATIVE[chainId]) ? native?.symbol : currencyIdB}`}
                          >
                            Receive {native?.symbol}
                          </InternalLink>
                        ) : null}
                      </RowBetween>
                    ) : null}
                  </CardBody>
                </Card>
              </AutoColumn>
            </>
          )}

          {showDetailed && (
            <Box mb="12px">
              <CurrencyInputPanel
                value={formattedAmounts[Field.LIQUIDITY]}
                onUserInput={onLiquidityInput}
                onPercentInput={(percent) => {
                  onUserInput(Field.LIQUIDITY_PERCENT, percent.toString())
                }}
                onMax={() => {
                  onUserInput(Field.LIQUIDITY_PERCENT, '100')
                }}
                showQuickInputButton
                showMaxButton
                lpPercent={formattedAmounts[Field.LIQUIDITY_PERCENT]}
                disableCurrencySelect
                currency={pair?.liquidityToken}
                pair={pair}
                id="liquidity-amount"
                onCurrencySelect={() => null}
                showCommonBases
                commonBasesType={CommonBasesType.LIQUIDITY}
              />
              <ColumnCenter>
                <ArrowDownIcon width="24px" my="16px" />
              </ColumnCenter>
              <CurrencyInputPanel
                beforeButton={<></>}
                hideBalance
                disabled={!removalCheckedA}
                value={formattedAmounts[Field.CURRENCY_A]}
                onUserInput={onCurrencyAInput}
                onMax={() => onUserInput(Field.LIQUIDITY_PERCENT, '100')}
                showMaxButton
                lpPercent={formattedAmounts[Field.LIQUIDITY_PERCENT]}
                currency={currencyA}
                label='Output'
                onCurrencySelect={handleSelectCurrencyA}
                id="remove-liquidity-tokena"
                showCommonBases
                commonBasesType={CommonBasesType.LIQUIDITY}
              />
              <ColumnCenter>
                <AddIcon width="24px" my="16px" />
              </ColumnCenter>
              <CurrencyInputPanel
                beforeButton={<></>}
                hideBalance
                disabled={!removalCheckedB}
                value={formattedAmounts[Field.CURRENCY_B]}
                onUserInput={onCurrencyBInput}
                showMaxButton={false}
                currency={currencyB}
                label='Output'
                onCurrencySelect={handleSelectCurrencyB}
                id="remove-liquidity-tokenb"
                showCommonBases
                commonBasesType={CommonBasesType.LIQUIDITY}
              />
            </Box>
          )}
          {pair && (
            <AutoColumn style={{ marginTop: '16px' }}>
              <Text color="secondary" fontSize="12px" textTransform="uppercase">
                Prices
              </Text>
              <Card>
                <CardBody p="8px">
                  <Flex justifyContent="space-between">
                    <Text small color="textSubtle">
                      1 {currencyA?.symbol} =
                    </Text>
                    <Text small>
                      {tokenA ? pair.priceOf(tokenA).toSignificant(6) : '-'} {currencyB?.symbol}
                    </Text>
                  </Flex>
                  <Flex justifyContent="space-between">
                    <Text small color="textSubtle">
                      1 {currencyB?.symbol} =
                    </Text>
                    <Text small>
                      {tokenB ? pair.priceOf(tokenB).toSignificant(6) : '-'} {currencyA?.symbol}
                    </Text>
                  </Flex>
                </CardBody>
              </Card>
            </AutoColumn>
          )}
          {/* <RowBetween mt="16px">
            <Text bold color="secondary" fontSize="12px">
              Max. slippage
              <IconButton scale="sm" variant="text" onClick={onPresentSettingsModal}>
                <PencilIcon color="primary" width="10px" />
              </IconButton>
            </Text>
            <Text bold color="primary">
              {allowedSlippage / 100}%
            </Text>
          </RowBetween> */}
          <Box position="relative" mt="16px">
            {!account ? (
              <ConnectWalletButton />
            ) : isWrongNetwork ? (
              <CommitButton width="100%" />
            ) : (
              <RowBetween>
                <Button
                  variant={
                    approval === ApprovalState.APPROVED || (signatureData !== null) ? 'success' : 'primary'
                  }
                  onClick={onAttemptToApprove}
                  disabled={approval !== ApprovalState.NOT_APPROVED || (signatureData !== null)}
                  width="100%"
                  mr="0.5rem"
                  height="48px"
                >
                  {approval === ApprovalState.PENDING ? (
                    <Dots>Enabling</Dots>
                  ) : approval === ApprovalState.APPROVED || (signatureData !== null) ? (
                    'Enabled'
                  ) : (
                    'Enable'
                  )}
                </Button>
                <Button
                  variant={
                    !isValid && !!parsedAmounts[Field.CURRENCY_A] && !!parsedAmounts[Field.CURRENCY_B]
                      ? 'danger'
                      : 'primary'
                  }
                  onClick={() => {
                    setLiquidityState({
                      attemptingTxn: false,
                      liquidityErrorMessage: undefined,
                      txHash: undefined,
                    })
                    onPresentRemoveLiquidity()
                  }}
                  width="100%"
                  disabled={
                    !isValid ||
                    (signatureData === null && approval !== ApprovalState.APPROVED) ||
                    (approval !== ApprovalState.APPROVED)
                  }
                  height="48px"
                >
                  {error || 'Remove'}
                </Button>
              </RowBetween>
            )}
          </Box>
        </AppBody>
      </Flex>

      {pair ? (
        <Flex justifyContent="center">
          <AutoColumn style={{ width: '100%', maxWidth: '464px', marginTop: '1rem' }}>
            <MinimalPositionCard showUnwrapped={oneCurrencyIsWNative} pair={pair} />
          </AutoColumn>
        </Flex>
      ) : null}

      <Flex justifyContent="center" mt="10px">
        <ArbitrumBridgeBox
          as={NextLinkFromReactRouter}
          to="https://app.uniswap.org/pools/v2/remove?chain=base"
          target='_blink'
          p="12px"
        >
          <Flex alignItems="center">
            <img 
              src='/images/uniswap-logo.png' 
              width="40px" 
              height="40px" 
              alt="bridgeIcon" 
              style={{borderRadius: "12px"}}
            />
            <Box ml="10px">
              <Text fontSize="16px" lineHeight="1.2" color="primaryDark">Remove Pool is based on the Uniswap V2 Router.</Text>
            </Box>
          </Flex>
          <Flex mr="10px">
            <OpenNewIcon color="primaryDark" />
          </Flex>
        </ArbitrumBridgeBox>
      </Flex>
    </Page>
  )
}
