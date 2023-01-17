import { RefObject, useCallback, useEffect, useRef, useState } from "react"
import hime from "../hime"
import { jamo, decomposeBlock, compose } from "../jamo"

// TODO: clean up

const useHime = (
    // TODO: consider content editable elements
    inputRef: RefObject<HTMLInputElement>,
    options?: AddEventListenerOptions) => {

    const [composing, setComposing] = useState(false)
    const [value, setValue] = useState('')


    function dispatchHimeInputEvent(v: string) {
        inputRef.current?.dispatchEvent(new CustomEvent('himeinput', {
            detail: { value: v }
        }))
    }

    const onKeyDown = useCallback((e: KeyboardEvent) => {
        const typedJamo = jamo.single.includes(e.key) ? e.key : hime.keyLookUp(e.key)

        if (typedJamo) {
            if (e.altKey || e.metaKey || e.ctrlKey) return
            e.preventDefault()
            const splitInput = value.split('')
            if (composing) {
                // note: block should not be able to be undefined here since composing
                const block = splitInput.pop() ?? ''
                const ending = hime.compose([...hime.decompose(block), typedJamo])
                splitInput.push(...ending)
                const newValue = splitInput.join('')
                dispatchHimeInputEvent(newValue)
            } else {
                dispatchHimeInputEvent(value + typedJamo)
                setComposing(true)
            }

        } else if (e.key.length === 1) {
            if (e.altKey || e.metaKey || e.ctrlKey) return
            // TODO: audit e.key.length === 1
            // is there a non typabled key with a length of 1?
            e.preventDefault()
            setComposing(false)
            dispatchHimeInputEvent(value + e.key)

        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault()
        } else if (e.key === 'Backspace') {
            e.preventDefault()
            // TODO: consider mac vs windows
            if (e.ctrlKey || e.metaKey) {
                dispatchHimeInputEvent('')
            } else {
                const splitInput = value.split('')
                const last = splitInput.pop()
                if (composing && last) {
                    let dl = decomposeBlock(last)
                    dl.pop()
                    if (dl.length) {
                        splitInput.push(compose(dl).join(''))
                    } else {
                        setComposing(false)
                    }
                }
                const newValue = splitInput.join('')
                dispatchHimeInputEvent(newValue)
            }

        } else if (e.key === 'Enter') {
            // TODO: consider submitevent
            // const event = new CustomEvent('enter', { detail: { value: inputRef.current.value } })
            // inputRef.current.dispatchEvent(event)

        } else if (e.key === 'Escape') {
            setComposing(false)
        }
        else {
            // ???
            // console.log('key???', e.key)
            // TODO: leave console user feedback note if someone checks this
        }
    }, [composing, value])


    const onHimeInput = (e: Event) => {
        const event = e as CustomEvent<{ value: string }>
        setValue(event.detail.value)
    }

    const keyDownHandlerRef = useRef(onKeyDown)

    useEffect(() => {
        keyDownHandlerRef.current = onKeyDown
    })

    useEffect(() => {
        const inputElement = inputRef?.current
        if (!inputElement) return

        // TODO: make readonly param
        inputElement.readOnly = true

        const internalKeyDownHandler = (e: KeyboardEvent) => keyDownHandlerRef.current(e)
        inputElement.addEventListener('keydown', internalKeyDownHandler)
        inputElement.addEventListener('himeinput', onHimeInput)
        return () => {
            inputElement.removeEventListener('keydown', internalKeyDownHandler)
            inputElement.removeEventListener('himeinput', onHimeInput)
        }
    }, [])

    return {
        input: {
            value,
            clear: () => setValue(''),
            set: (value: string) => setValue(value)
        },
        composing
    }

}

export default useHime