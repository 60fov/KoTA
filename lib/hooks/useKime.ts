import { type RefObject, useCallback, useEffect, useRef, useState } from "react"
import kime from "../kime"
import { jamo, decomposeBlock, compose } from "../kime/jamo"
import { KimeEvent } from "lib/kime/event"

// TODO: clean up

export interface TKime {
    value: string
    clear: () => void
    setValue: (v: string) => void
    isComposing: boolean
    hasFocus: boolean
}

const useKime = (
    // TODO: consider content editable elements
    inputRef: RefObject<HTMLInputElement>,
    // options?: AddEventListenerOptions
): TKime => {
    const [hasFocus, setHasFocus] = useState(false)
    const [isComposing, setIsComposing] = useState(false)
    const [value, setValue] = useState('')

    const refValue = useRef("")
    const refIsComposing = useRef(false)


    function dispatchKimeInputEvent(value: string) {
        if (!inputRef.current) return
        KimeEvent.dispatchInputEvent(value, inputRef.current)
    }

    function dispatchKimeCompositionEvent(composing: boolean) {
        if (!inputRef.current) return
        KimeEvent.dispatchCompositionEvent(composing, inputRef.current)
    }

    // TODO check of not using a callback here
    // TODO clean up logic
    const onKeyDown = useCallback((e: KeyboardEvent) => {
        const value = refValue.current
        const isComposing = refIsComposing.current

        const typedJamo = jamo.single.includes(e.key) ? e.key : kime.keyLookUp(e.key)

        if (typedJamo) {
            if (e.altKey || e.metaKey || e.ctrlKey) return
            e.preventDefault()
            const splitInput = value.split('')
            if (isComposing) {
                // note: block should not be able to be undefined here since composing
                const block = splitInput.pop() ?? ''
                const ending = kime.compose([...kime.decompose(block), typedJamo])
                splitInput.push(...ending)
                const newValue = splitInput.join('')
                refValue.current = newValue
            } else {
                refValue.current = value + typedJamo
                refIsComposing.current = true
            }

        } else if (e.key.length === 1) {
            if (e.altKey || e.metaKey || e.ctrlKey) return
            // TODO: audit e.key.length === 1
            // is there a non typabled key with a length of 1?
            e.preventDefault()
            refIsComposing.current = false
            refValue.current = value + e.key

        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault()
        } else if (e.key === 'Backspace') {
            e.preventDefault()
            // TODO: consider mac vs windows
            if (e.ctrlKey || e.metaKey) {
                refValue.current = ''
            } else {
                const splitInput = value.split('')
                const last = splitInput.pop()
                if (isComposing && last) {
                    const dl = decomposeBlock(last)
                    dl.pop()
                    if (dl.length) {
                        splitInput.push(compose(dl as string[]).join(''))
                    } else {
                        refIsComposing.current = false
                    }
                }
                const newValue = splitInput.join('')
                refValue.current = newValue
            }

        } else if (e.key === 'Enter') {
            // TODO: consider submitevent
            // const event = new CustomEvent('enter', { detail: { value: inputRef.current.value } })
            // inputRef.current.dispatchEvent(event)

        } else if (e.key === 'Escape') {
            refIsComposing.current = false
        }
        else {
            // ???
            // console.log('key???', e.key)
            // TODO: leave console user feedback note if someone checks this
        }


        // TODO technically composition events should fire when ending and starting with same key
        // find logic for recomposing
        if (value !== refValue.current) dispatchKimeInputEvent(refValue.current)
        if (isComposing !== refIsComposing.current) dispatchKimeCompositionEvent(refIsComposing.current)
    }, [])

    const onFocus = () => {
        setHasFocus(true)
    }

    const onBlur = () => {
        setHasFocus(false)
    }

    const onKimeEvent = (event: KimeEvent) => {
        // console.log(event.detail)
        switch (event.detail.type) {
            case "input": {
                setValue(event.detail.value)
            } break;
            case "composition": {
                setIsComposing(event.detail.composing)
            } break;
        }
    }

    // TODO can i do this instead?
    // useEventListener("keydown", onKeyDown, inputRef)
    // useEventListener("keydown", onKeyDown, inputRef)
    // useEventListener("keydown", onKeyDown, inputRef)
    // useEventListener("keydown", onKeyDown, inputRef)


    const keyDownHandlerRef = useRef(onKeyDown)

    useEffect(() => {
        keyDownHandlerRef.current = onKeyDown
    })

    useEffect(() => {
        const inputElement = inputRef?.current
        if (!inputElement) return

        // readonly makes virtual kb not show up
        // TODO: make readonly param
        // inputElement.readOnly = true

        const internalKeyDownHandler = (e: KeyboardEvent) => keyDownHandlerRef.current(e)
        inputElement.addEventListener('keydown', internalKeyDownHandler)
        inputElement.addEventListener('kime', onKimeEvent)
        inputElement.addEventListener('focus', onFocus)
        inputElement.addEventListener('blur', onBlur)
        return () => {
            inputElement.removeEventListener('keydown', internalKeyDownHandler)
            inputElement.removeEventListener('kime', onKimeEvent)
            inputElement.removeEventListener('focus', onFocus)
            inputElement.removeEventListener('blur', onBlur)
        }
    }, [])

    function clear() {
        refIsComposing.current = false
        refValue.current = ''
        setValue('')
        setIsComposing(false)
        // use if kimeevent consumed outside of hook
        // if (inputRef.current) {
        //     KimeEvent.dispatchCompositionEvent(false, inputRef.current)
        //     KimeEvent.dispatchInputEvent('', inputRef.current)
        // }
    }

    return {
        value,
        setValue,
        clear,
        isComposing,
        hasFocus,
    }

}

export default useKime