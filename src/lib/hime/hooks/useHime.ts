import { RefObject, useEffect, useRef } from "react"
import hime from "../hime"
import { jamo, composeBlock, decompose, decomposeBlock, compose } from "../jamo"

// TODO: switch to input events (beforeinput rework)
// note, can't use react event doesn't have all the needed data
// i.e. addEventListener on ref

// export type HimeKeyEventHandler = (e: KeyboardEvent) => void

const useHime = (
    options?: AddEventListenerOptions) => {
    // TODO: consider content editable elements
    const inputRef = useRef<HTMLInputElement>(null)
    const composingRef = useRef(false)

    const onKeyDown = (e: KeyboardEvent) => {
        // ts narrowing
        if (!inputRef.current) return

        // Escape
        // Shift

        switch (e.key) {
            case 'ArrowLeft' || 'ArrowRight' || 'ArrowUp' || 'ArrowDown': {
                e.preventDefault()
                break
            } case 'Backspace': {
                e.preventDefault()
                const composing = composingRef.current
                const input = inputRef.current.value.split('')
                const last = input.pop()
                if (composing && last) {
                    let dl = decomposeBlock(last)
                    dl.pop()
                    if (dl.length) {
                        input.push(compose(dl).join(''))
                    } else {
                        composingRef.current = false
                    }
                }
                inputRef.current.value = input.join('')
                // const inputEvent = new InputEvent('input', { data: inputRef.current.value })
                // inputRef.current.dispatchEvent(inputEvent)
                break
            } case 'Enter': {
                // const event = new CustomEvent('enter', { detail: { value: inputRef.current.value } })
                // inputRef.current.dispatchEvent(event)
                break
            } case 'Tab': {
                break
            } default: {
                // gotta let em' run em'
                if (e.altKey || e.metaKey || e.ctrlKey) break

                // TODO: consider firing events (spec??? 👀)
                const typedJamo = jamo.single.includes(e.key) ? e.key : hime.keyLookUp(e.key)
                if (typedJamo) {
                    e.preventDefault()
                    const composing = composingRef.current
                    const input = inputRef.current.value.split('')
                    if (composing) {
                        // note: block should not be able to be undefined here since composing
                        const block = input.pop() ?? ''
                        const ending = hime.compose([...hime.decompose(block), typedJamo])
                        input.push(...ending)
                        inputRef.current.value = input.join('')
                    } else {
                        inputRef.current.value += typedJamo
                        composingRef.current = true
                    }
                } else if (e.key.length === 1) {
                    // TODO: audit e.key.length === 1
                    // is there a non typabled key with a length of 1?
                    e.preventDefault()
                    composingRef.current = false
                    inputRef.current.value += e.key
                } else {
                    // ???
                    // console.log('key???', e.key)
                }

                // const inputEvent = new InputEvent('input', { data: inputRef.current.value })
                // inputRef.current.dispatchEvent(inputEvent)
            }
        }
    }

    const onCompositionStart = (e: CompositionEvent) => {
        // composingRef.current = true
    }

    const onCompositionEnd = (e: CompositionEvent) => {
        // composingRef.current = false
    }

    useEffect(() => {
        const inputElement = inputRef?.current
        if (!inputElement) return

        inputElement.readOnly = true

        inputElement.addEventListener('keydown', onKeyDown)
        inputElement.addEventListener('compositionstart', onCompositionStart)
        inputElement.addEventListener('compositionend', onCompositionEnd)

        // const internalInputHandler = (e: KeyboardEvent) => inputHandlerRef.current(e)

        // inputElement.addEventListener('keydown', internalInputHandler, options)
        return () => {
            inputElement.removeEventListener('keydown', onKeyDown)
            inputElement.removeEventListener('compositionstart', onCompositionStart)
            inputElement.removeEventListener('compositionend', onCompositionEnd)
            // inputElement.removeEventListener('keydown', internalInputHandler, options)
        }
    }, [])

    return inputRef

}

export default useHime