import { BigintIsh } from 'libraries/swap-sdk-core'

export function toBigInt(num: BigintIsh): bigint {
  return typeof num === 'bigint' ? num : BigInt(num.toString())
}
