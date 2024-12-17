/* eslint-disable no-param-reassign */
import { createReducer } from '@reduxjs/toolkit'
import { ChainId } from 'config/chains'

export interface GlobalState {
  showFarmTransactionModal: boolean
  pickedFarmTransactionModalTx: {
    tx: string
    chainId: ChainId
  }
}

export const initialState: GlobalState = {
  showFarmTransactionModal: false,
  pickedFarmTransactionModalTx: {
    tx: '',
    chainId: ChainId.BSC,
  },
}

export default createReducer(initialState, (builder) =>
  builder,
)