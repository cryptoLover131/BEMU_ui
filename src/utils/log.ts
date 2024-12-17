import { Currency } from 'libraries/swap-sdk-core'
import { log } from 'next-axiom'

export const logTx = ({ account, hash, chainId }: { account: string; hash: string; chainId: number }) => {
  fetch(`/api/_log/${account}/${chainId}/${hash}`)
}

export const logSwap = ({
  input,
  output,
  inputAmount,
  outputAmount,
  chainId,
  account,
  hash,
}: {
  input: Currency
  output: Currency
  inputAmount: string
  outputAmount: string
  chainId: number
  account: `0x${string}`
  hash: `0x${string}`
}) => {
  try {
    log.info("Swap", {
      inputAddress: input.isToken ? input.address.toLowerCase() : input.symbol,
      outputAddress: output.isToken ? output.address.toLowerCase() : output.symbol,
      inputAmount,
      outputAmount,
      account,
      hash,
      chainId,
    })
  } catch (error) {
    //
  }
}
