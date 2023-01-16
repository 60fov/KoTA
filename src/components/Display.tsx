import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import useFocusElementOnKey from "../hooks/useFocusElementOnKey"
import useHime from "../lib/hime/hooks/useHime"
import { cn } from "../util/css"
import { Word } from "../util/hangul"
import { useTTSSettingsStore } from "../util/stores"
import tts from "../util/tts"
import Input, { InputDisplay } from "./Input"
import WordSlider, { WordSliderHandle } from "./WordSlider"

const SinglWordMode = () => {
    const [input, setInput] = useState('')
    const [focused, setFocused] = useState(false)

    const ttsEnabled = useTTSSettingsStore((state) => state.enabled)

    const wordSliderRef = useRef<WordSliderHandle>(null)
    const inputRef = useHime()
    useFocusElementOnKey(inputRef)


    useEffect(() => {
        if (focused) {
            const word = wordSliderRef.current?.word()
            if (ttsEnabled && word) {
                tts.speak(word.kr, {
                    lang: 'ko-KR',
                    rate: 0.8,
                    force: true
                })
            }
        }
    }, [focused])

    const onInput = (e: InputEvent) => {
        // TODO: usehime fix inputevent to send only input key
        console.log('input', e.data)
    }

    const onWordChange = (word: Word) => {
        if (ttsEnabled) {
            tts.speak(word.kr, {
                lang: 'ko-KR',
                rate: 0.8,
                force: true
            })
        }
    }

    const onKeyDown = (e: KeyboardEvent) => {
        if (!inputRef.current || !wordSliderRef.current) return
        const value = inputRef.current.value
        const slider = wordSliderRef.current

        // if (e.key === 'ArrowLeft') slider.prev()
        // if (e.key === 'ArrowRight') slider.next()

        if (e.key === 'Enter') {
            if (e.shiftKey || value === slider.word().kr) {
                nextWord()
            }
        } else if (e.key === ' ' && value.slice(0, -1) === slider.word().kr) {
            nextWord()
        } else {
            setInput(value)
        }
    }

    function nextWord() {
        wordSliderRef.current?.next()
        // TODO: audit
        // would prefer to not setInput and clear inputRef value
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
                )}
                onWordChange={onWordChange} />
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
