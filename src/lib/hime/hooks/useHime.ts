import { RefObject, useEffect, useRef } from "react"
import hime from "../hime"
import { composeBlock } from "../jamo"

export const EMPTY_OUTPUT = {
    blocks: '',
    composing: '',
    jamo: ''
} as const

export type HimeOutput = {
    blocks: string
    composing: string
    jamo: string | undefined
}

export type HimeKeyEventHandler = (e: KeyboardEvent, output: HimeOutput, clear: () => void) => void

// TODO: switch to input events (rework)

const useHime = (
    inputRef: RefObject<HTMLInputElement>,
    onKey: HimeKeyEventHandler,
    options?: AddEventListenerOptions) => {
    const blocks = useRef('')
    const active = useRef('')
    const buffer = useRef<string[]>([])

    const clear = () => {
        blocks.current = ''
        active.current = ''
        buffer.current.length = 0
        if (inputRef.current) inputRef.current.value = ''
    }

    const inputHandler = (e: KeyboardEvent) => {
        if (inputRef.current === null) return

        // TODO: consider how hime settings are changed (context?)
        const jamo = hime.keyLookUp(e.key)
        if (e.key.length === 1) {
            if (e.altKey || e.ctrlKey || e.metaKey) return
            e.preventDefault()
            if (jamo !== undefined) {
                buffer.current.push(jamo)
                const [block, ...rest] = composeBlock(buffer.current)
                if (rest.length !== 0) {
                    buffer.current = rest
                    active.current = composeBlock(buffer.current)[0]
                    blocks.current += block
                } else {
                    active.current = block
                }
            } else {
                active.current = ''
                blocks.current += composeBlock(buffer.current)[0] + e.key
                buffer.current.length = 0
                // buffer.current.push(e.key)
            }
        } else if (e.key === 'Backspace') {
            e.preventDefault()
            // TODO: consider mac vs windows controls
            if (e.metaKey || e.altKey || e.ctrlKey) {
                // TODO: fix
                if (!composeBlock(buffer.current)[0]) blocks.current = blocks.current.slice(-1, blocks.current.lastIndexOf(' '))
                else active.current = ''
                buffer.current.length = 0
            } else {
                const b = buffer.current.pop()
                if (b) active.current = composeBlock(buffer.current)[0]
                else blocks.current = blocks.current.slice(0, -1)
            }
        } else if (e.key === "Escape") {
            blocks.current += composeBlock(buffer.current)[0]
            active.current = ''
            buffer.current.length = 0
        }

        inputRef.current.value = blocks.current + active.current
        if (onKey) onKey(e, { blocks: blocks.current, composing: active.current, jamo }, clear)

        // inputRef.current?.dispatchEvent(new InputEvent('himeinput', {
        //     data: blocks.current,
        //     inputType: 'idk',
        //     isComposing: true
        // }))
    }

    const inputHandlerRef = useRef(inputHandler)

    useEffect(() => {
        inputHandlerRef.current = inputHandler
    })

    useEffect(() => {
        const inputElement = inputRef?.current
        if (!inputElement) return
        const internalInputHandler = (e: KeyboardEvent) => inputHandlerRef.current(e)

        // TODO onbeforeinput
        // inputElement.addEventListener('beforeinput', )
        inputElement.addEventListener('keydown', internalInputHandler, options)
        return () => {
            inputElement.removeEventListener('keydown', internalInputHandler, options)
        }
    }, [])

    return inputHandler
}

export default useHime