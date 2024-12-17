import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { Button, ButtonProps } from './Button'

const wrongNetworkProps: ButtonProps = {
  variant: 'danger',
  disabled: false,
  children: 'Wrong Network',
}

export const CommitButton = (props: ButtonProps) => {
  const { isWrongNetwork } = useActiveChainId()
  const { open } = useWeb3Modal()

  return (
    <Button
      {...props}
      onClick={(e) => {
        if (isWrongNetwork) {
          open({ view: "Networks" })
        } else {
          props.onClick?.(e)
        }
      }}
      {...(isWrongNetwork && wrongNetworkProps)}
    />
  )
}
