import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import useFocusElementOnKey from "../hooks/useFocusElementOnKey"
import useHime from "../lib/hime/hooks/useHime"
import { cn } from "../util/css"
import Input, { InputDisplay } from "./Input"
import WordSlider, { WordSliderHandle } from "./WordSlider"

const SinglWordMode = () => {
    const wordSliderRef = useRef<WordSliderHandle>(null)

    const [focused, setFocused] = useState(false)

    const [input, setInput] = useState('')

    const inputRef = useHime()
    useFocusElementOnKey(inputRef)

    useEffect(() => {
    }, [])

    const onInput = (e: InputEvent) => {
        // TODO: usehime fix inputevent to send only input key
        console.log('input', e.data)
    }

    const onKeyDown = (e: KeyboardEvent) => {
        if (!inputRef.current || !wordSliderRef.current) return
        const value = inputRef.current.value
        const slider = wordSliderRef.current

        // if (e.key === 'ArrowLeft') slider.prev()
        // if (e.key === 'ArrowRight') slider.next()

        if (e.key === 'Enter') {
            if (e.shiftKey || value === slider.word().kr) {
                slider.next()
                clearInput()
            }
        } else if (e.key === ' ' && value.slice(0, -1) === slider.word().kr) {
            slider.next()
            clearInput()
        } else {
            setInput(value)
        }
    }

    // TODO: audit clearInput function
    // I would prefer this not exist tbh
    function clearInput() {
        setInput('')
        if (inputRef.current) inputRef.current.value = ''
    }

    return (
        <motion.div className="flex flex-col items-center gap-6">
            <WordSlider
                ref={wordSliderRef}
                wordCount={5}
                className={cn(
                    "transition-all",
                    !focused && "blur"
                )} />
            <Input
                className="absolute [clip:rect(0,0,0,0)]"
                ref={inputRef}
                onInput={onInput}
                onKeyDown={onKeyDown}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)} />
            <InputDisplay
                input={input}
                focused={focused} />
        </motion.div >
    )
}


export default SinglWordMode
