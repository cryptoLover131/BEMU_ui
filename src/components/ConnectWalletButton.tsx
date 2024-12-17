const ConnectWalletButton = ({size} : {size?: "md" | "sm"}) => {
  if (size)
    return <w3m-button size={size} />
  return <w3m-button size="sm" />
}

export default ConnectWalletButton
