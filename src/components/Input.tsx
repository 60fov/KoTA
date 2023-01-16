import { motion, useSpring } from "framer-motion"
import { CSSProperties, FocusEventHandler, forwardRef, HTMLInputTypeAttribute, useEffect, useImperativeHandle, useRef } from "react"
import { cn } from "../util/css"

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

interface InputDisplayProps {
    input: string
    focused: boolean
}

// TODO: error indication
const InputDisplay = (props: InputDisplayProps) => {
    const { input, focused, ...restProps } = props

    const ch = useSpring(0, {
        stiffness: 150,
        damping: 10,
        mass: 0.5
    })

    // TODO: audit, remove effect
    useEffect(() => {
        if (focused) ch.set(1)
        else ch.set(0)
    }, [focused])

    return (
        <div className="relative flex">
            <div className={cn(
                "h-12",
                "text-front text-5xl font-semibold")}>
                {/* TODO: make space symbol a settings  */}
                {input.replaceAll(' ', '•').split('').map((block, i) => (
                    <span key={block + `${i}`}>{block}</span>
                ))}
            </div>
            <motion.div layout="position"
                style={{ scaleY: ch }}
                animate={{ opacity: [0.25, 1] }}
                transition={{
                    opacity: {
                        type: 'tween',
                        ease: 'easeOut',
                        duration: 0.9,
                        repeat: Infinity,
                        repeatType: 'mirror',
                    },
                    layout: {}
                }}
                className="absolute -right-2 h-12 translate-x-full w-1 bg-front rounded-[1px]" />
        </div>
    )

}

export default Input
export { InputDisplay }