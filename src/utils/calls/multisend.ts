import { parseEther } from "viem"

export const multiSendToken = async (multisenderContract, token, addresses, amounts, tag) => {
  return multisenderContract.write.multisendToken([token, false, addresses, amounts, tag], {})
}

export const multiSendEther = async (multisenderContract, totalAmount, addresses, amounts, tag) => {
  return multisenderContract.write.multisendEther([addresses, amounts, tag], {
    value: parseEther(totalAmount.toString())
  })
}