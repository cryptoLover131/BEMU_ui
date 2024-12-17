import ListsUpdater from './state/lists/updater'
import MulticallUpdater from './state/multicall/updater'
import TransactionUpdater from './state/transactions/updater'
import { chains } from './utils/wagmi'

export function Updaters() {
  return (
    <>
      <ListsUpdater />
      {chains.map((chain) => (
        <TransactionUpdater key={`trxUpdater#${chain.id}`} chainId={chain.id} />
      ))}
      <MulticallUpdater />
    </>
  )
}
