import { CSSProperties, FocusEventHandler, forwardRef, HTMLInputTypeAttribute, useEffect, useImperativeHandle, useRef } from "react"

interface Props {
    style?: CSSProperties
    className?: string
    placeholder?: string
    onInput?: (e: InputEvent) => void
    onKeyDown?: (e: KeyboardEvent) => void
    onFocus?: FocusEventHandler
    onBlur?: FocusEventHandler
}

export type Ref = HTMLInputElement

const Input = forwardRef<Ref, Props>((props, ref) => {
    const { onInput, onKeyDown, ...restProps } = props

    const inputRef = useRef<HTMLInputElement>(null)

    // @ts-ignore
    useImperativeHandle(ref, () => inputRef.current)

    useEffect(() => {
        if (!inputRef.current) return

        if (onInput) inputRef.current.addEventListener('input', onInput as (e: Event) => void)
        if (onKeyDown) inputRef.current.addEventListener('keydown', onKeyDown)
        return () => {
            if (onInput) inputRef.current?.removeEventListener('input', onInput as (e: Event) => void)
            if (onKeyDown) inputRef.current?.removeEventListener('keydown', onKeyDown)
        }
    }, [inputRef, onInput, onKeyDown])

    return (
        <input ref={inputRef} type="text" {...restProps} />
    )
})

export default Input