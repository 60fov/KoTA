import { KeyboardEvent, KeyboardEventHandler, useCallback, useEffect, useRef, useState } from "react"
import hime from "../hime"
import { composeBlock } from "../jamo"

export type HimeInputType =
    HimeInputComplete |
    HimeInputIncomplete |
    HimeInputDeleteChar |
    HimeInputDeleteWord |
    HimeInputDeleteLine |
    HimeInputEnd


export type DeleteType = "single" | "word" | "line"

export type HimeInputIncomplete = {
    type: "incomplete"
    syllable: string,
    key: string
}

export type HimeInputComplete = {
    type: 'complete',
    completed: string
    new: string
    key: string
}

export type HimeInputEnd = {
    type: 'end'
    completed: string
}

export type HimeInputDeleteChar = {
    type: "delete"
    deleteType: "char"
    key: string
    syllable: string
}

export type HimeInputDeleteWord = {
    type: "delete"
    deleteType: "word"
    word: string
}

export type HimeInputDeleteLine = {
    type: "delete"
    deleteType: "line"
    line: string
}

export type useInputHandlerOptions = {
    onKey?: (e: KeyboardEvent) => void
    onInput?: (input: HimeInputType) => void
}

// TODO: feels too stateful
const useInputHandler = (options?: useInputHandlerOptions) => {
    const onKey = options?.onKey
    const onInput = options?.onInput || (() => ({}))

    const buffer = useRef<string[]>([])

    const clear = () => {
        buffer.current.length = 0
    }

    const inputHandler = useCallback((e: KeyboardEvent) => {
        // TODO: consider how hime settings are change (context?)

        if (e.key.length === 1) {
            const jamo = hime.keyLookUp(e.key)
            if (jamo !== undefined) {
                buffer.current.push(jamo)
                const [block, ...rest] = composeBlock(buffer.current)
                if (rest.length !== 0) {
                    buffer.current = rest
                    onInput({
                        type: 'complete',
                        completed: block,
                        new: composeBlock(buffer.current)[0],
                        key: jamo,
                    })
                } else {
                    onInput({
                        type: "incomplete",
                        syllable: block,
                        key: jamo
                    })
                }
            } else {
                onInput({
                    type: 'complete',
                    completed: composeBlock(buffer.current)[0],
                    new: e.key,
                    key: e.key,
                })
                buffer.current.length = 0
                buffer.current.push(e.key)
            }
        } else if (e.key === 'Backspace') {
            // TODO: consider mac vs windows controls
            if (e.metaKey || e.altKey || e.ctrlKey) {
                onInput({
                    type: 'delete',
                    deleteType: 'word',
                    word: composeBlock(buffer.current)[0]
                })
                buffer.current.length = 0
            } else {
                const key = buffer.current.pop() || ''
                onInput({
                    type: 'delete',
                    deleteType: 'char',
                    key,
                    syllable: composeBlock(buffer.current)[0]
                })
            }
        } else if (e.key === "Escape") {
            onInput({
                type: 'end',
                completed: composeBlock(buffer.current)[0],
            })
            buffer.current.length = 0
        }

        if (onKey) onKey(e)

    }, [focus, onKey, onInput])

    return [inputHandler, clear] as const
}

export default useInputHandler