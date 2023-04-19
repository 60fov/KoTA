import { createContext } from "react"

type EnLayout = "QWERTY"
type KrLayout = "2-SET"

// not sure if this should be an interface
export interface KeyboardContextInterface {
    size: number
    layout: {
        en: EnLayout
        kr: KrLayout
    },
    showJamo: boolean
    showCode: boolean
    showOnShift: boolean
    // TODO: key char placement
}

export const KeyboardContext = createContext<KeyboardContextInterface>({
    size: 50,
    layout: {
        en: "QWERTY",
        kr: "2-SET"
    },
    showJamo: true,
    showCode: true,
    showOnShift: true
})

export const KeyboardProvider = KeyboardContext.Provider