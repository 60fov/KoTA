import { AnimatePresence, motion, useSpring } from "framer-motion"
import { forwardRef, KeyboardEvent, KeyboardEventHandler, useEffect, useImperativeHandle, useRef, useState } from "react"
import useFocusElementOnKey from "../hooks/useFocusElementOnKey"
import useHime, { HimeInput } from "../lib/hime/hooks/useHime"
import { cn } from "../util/css"
import { Word } from "../util/hangul"

interface Props {
    // focused?: boolean
    errorTest?: (i: number, v: string, composing: boolean) => boolean
    onKeyDown?: (e: KeyboardEvent) => void
    onSubmit?: (value: string) => void
    onChange?: (value: string) => void
}

export interface InputRef extends HimeInput {
    focused: boolean
    element: () => HTMLInputElement | null
}

const Input = forwardRef<InputRef, Props>((props, ref) => {
    const {
        // focused: focusedProp,
        onKeyDown: onKeyDownProp,
        onSubmit: onSubmitProp,
        onChange: onChangeProp,
        errorTest = () => false
    } = props

    const inputRef = useRef<HTMLInputElement>(null)
    const [focused, setFocused] = useState(false)
    const { input, composing } = useHime(inputRef)
    useFocusElementOnKey(inputRef)

    const ch = useSpring(0, {
        stiffness: 150,
        damping: 10,
        mass: 0.5
    })

    // TODO: audit, remove effect
    useEffect(() => {
        if (focused) {
            inputRef.current?.focus()
            ch.set(1)
        } else {
            inputRef.current?.blur()
            ch.set(0)
        }
    }, [focused])

    useEffect(() => {
        if (onChangeProp) onChangeProp(input.value)
    }, [input.value])

    const onKeyDown: KeyboardEventHandler = (e) => {
        if (onKeyDownProp) onKeyDownProp(e)
        if (e.key === 'Enter') {
            if (onSubmitProp) onSubmitProp(input.value)
        }
    }

    useImperativeHandle(ref, () => {
        return {
            ...input,
            focused,
            element() {
                return inputRef.current
            }
        }
    })

    const value = input.value.replaceAll(' ', '•')
    return (
        <>
            <input
                className="absolute [clip:rect(0,0,0,0)]"
                ref={inputRef}
                onKeyDown={onKeyDown}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
            />
            <div className="relative flex">
                <div className={cn(
                    "h-12 whitespace-nowrap",
                    "text-front text-5xl font-semibold")}>
                    {/* TODO: make space symbol a settings  */}
                    {value.split('').map((block, i) => (
                        <span key={block + `${i}`}
                            className={cn(
                                "relative transition-colors",
                                errorTest(i, input.value, composing) && "text-error",
                                input.value[i] === ' ' && "opacity-50"
                            )}>
                            {block}
                            {composing && i === value.length - 1 ?
                                <motion.span
                                    layoutId="composing-indicator"
                                    className="absolute h-[2px] left-0 right-0 top-full rounded-sm bg-front" />
                                :
                                <></>
                            }
                        </span>
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
        </>
    )
})

export default Input 