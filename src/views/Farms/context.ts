import { FarmWithStakedValue } from 'libraries/farms'
import { createContext } from 'react'

export const FarmsContext = createContext<{chosenFarms: FarmWithStakedValue[]}>({ chosenFarms: [] })
