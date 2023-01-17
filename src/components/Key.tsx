import { useContext } from "react"
import { useKeyState } from "use-key-state"
import hime from "../lib/hime/hime"
import { cn } from "../util/css"
import { KeyboardContext } from "./KeyboardContext"

type Props = {
    code?: string
    label?: string
    down?: boolean
    keyWidth?: number
    expand?: boolean
}

// TODO: find alternative to useKeyState repeat flag no work
// TODO: switch to position centric pacement of key symbols
const Key = ({ code, down, label, keyWidth = 1, expand = false }: Props) => {
    const { size, showJamo, showCode, showOnShift } = useContext(KeyboardContext)
    const h = size
    const w = size * keyWidth

    const jamo = code ? hime.keyLookUp(code) : undefined
    const shiftJamo = code ? hime.keyLookUp(code.toUpperCase()) : undefined

    const { state } = useKeyState({ state: code || "" }, {
        ignoreInputAcceptingElements: false,
        ignoreRepeatEvents: true
    })

    const { state: shiftState } = useKeyState({ state: "shift" }, {
        ignoreInputAcceptingElements: false,
        ignoreRepeatEvents: true
    })

    return (
        <div
            style={{ width: w, height: h }}
            className={cn(
                "relative inline-grid grid-cols-3 grid-rows-3 items-center",
                "rounded-md leading-none font-medium",
                "text-front/90 bg-front-alt/10 border-[rgb(0,0,0)]/20",
                "transition-all duration-75 select-none",
                expand ? 'grow' : '',
                state.pressed ? 'border-b-0 translate-y-[2px] bg-front-alt/90 text-back/90' : 'border-b-2 translate-y-0'
            )}>
            {!showOnShift ? <span className="row-start-1 col-start-2 text-center text-xs leading-none">{shiftJamo}</span> : <></>}
            {showJamo ? <span className="row-start-2 col-start-2 text-center">
                {shiftJamo && showOnShift && shiftState.pressed ? shiftJamo : jamo}
            </span> : <></>}
            {showCode ? <span className="text-xs leading-none italic opacity-50 absolute bottom-[5px] right-[5px]">{label ?? code}</span> : <></>}
        </div>
    )
}

export default Key

