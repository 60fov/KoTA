import { KeyboardEvent, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

import useFocusElementOnKey from "../hooks/useFocusElementOnKey"
import useHime from "../lib/hime/hooks/useHime"

import InputDisplay from "./InputDisplay"
import WordSlider, { WordSliderHandle } from "./WordSlider"
import { useTTSSettingsStore } from "../util/stores"

import tts from "../util/tts"
import { cn } from "../util/css"
import { Word } from "../util/hangul"

const Display = () => {
    const [focused, setFocused] = useState(false)

    const wordSliderRef = useRef<WordSliderHandle>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const ttsEnabled = useTTSSettingsStore((state) => state.enabled)
    const { input, composing } = useHime(inputRef)
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
        if (!wordSliderRef.current) return
        const word = wordSliderRef.current.word()

        // if (e.key === 'ArrowLeft') slider.prev()
        // if (e.key === 'ArrowRight') slider.next()

        if (e.key === 'Enter') {
            if (e.shiftKey || input.value === word.kr) {
                nextWord()
            }
        } else if (e.key === ' ' && input.value === word.kr) {
            nextWord()
            e.preventDefault()
        }
    }

    function nextWord() {
        wordSliderRef.current?.next()
        input.clear()
    }

    return (
        <div className="relative flex justify-center">
            {!focused &&
                <AnimatePresence>
                    <motion.span
                        key={"focus-text"}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute bottom-0 text-front/75 text-3xl font-semibold z-10">
                        type to focus
                    </motion.span>
                </AnimatePresence>
            }
            <div className={cn(
                "relative flex flex-col items-center gap-6",
                "transition-all",
                !focused && "blur")}>
                <WordSlider
                    ref={wordSliderRef}
                    wordCount={5}
                    onWordChange={onWordChange} />
                <input
                    className="absolute [clip:rect(0,0,0,0)]"
                    ref={inputRef}
                    onKeyDown={onKeyDown}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)} />
                <InputDisplay
                    goal={wordSliderRef.current?.word().kr}
                    input={input.value}
                    composing={composing}
                    focused={focused} />
            </div>
        </div>
    )
}


export default Display
