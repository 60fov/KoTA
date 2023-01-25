import { KeyboardEvent, useEffect, useRef, useState } from "react"

import Input, { InputRef } from "./Input"
import HSlider, { HSliderRef } from "./HSlider"
import WordSlider, { WordSliderRef } from "./WordSlider"

import { useDisplaySettingsStore, useTTSSettingsStore } from "../util/stores"
import tts, { SpeakOptions } from "../util/tts"
import { cn } from "../util/css"
import { Word } from "../util/hangul"
import { decompose } from "../lib/hime/jamo"

const Display = () => {
    const helperRef = useRef<HSliderRef>(null)
    const sliderRef = useRef<WordSliderRef>(null)
    const inputRef = useRef<InputRef>(null)

    // const [focused, setFocused] = useState(false)
    const [word, setWord] = useState<Word>()
    const decomposedWord = decompose(word?.kr || "")

    const { ttsEnabled, ...ttsOptions } = useTTSSettingsStore((state) => ({
        ttsEnabled: state.enabled,
        volume: state.volume,
        pitch: state.pitch,
        rate: state.rate
    }))

    const speakOptions: SpeakOptions = {
        lang: 'ko-KR',
        force: true,
        rate: ttsOptions.rate,
        pitch: ttsOptions.pitch,
    }

    const displaySettings = useDisplaySettingsStore((state) => ({
        showDecomposed: state.showDecomposed,
        showTranslation: state.showTranslation,
        showSpaces: state.showSpaces,
    }))

    useEffect(() => {
        if (ttsEnabled && word) {
            tts.speak(word.kr, speakOptions)
        }
    }, [])

    const onWordChange = (word: Word) => {
        setWord(word)

        if (ttsEnabled) {
            tts.speak(word.kr, speakOptions)
        }
    }

    const onKeyDown = (e: KeyboardEvent) => {
        if (!word) return

        if (e.key === ' ' && inputRef.current?.value === word.kr) {
            nextWord()
            e.preventDefault()
        }

        if (e.key === 'Enter' && e.shiftKey) {
            nextWord()
        }

        if (e.code === 'KeyT' && e.altKey && ttsEnabled) {
            tts.speak(word.kr, {
                lang: 'ko-KR',
                rate: 0.8,
                force: true
            })
        }
    }

    const onInputChange = (value: string) => {
        if (helperRef.current) {
            const jamo = decompose(value)
            const length = Math.min(jamo.length, decomposedWord.length)
            let j = 0
            for (let i = 0; i < length; i++) {
                if (jamo[i] !== decomposedWord[i]) break
                j = i + 1
            }
            helperRef.current.setIndex(j)
        }
    }

    function nextWord() {
        sliderRef.current?.next()
        inputRef.current?.clear()
    }

    // TODO: rewrite composing vs non-composing check
    // if composing compare upto last block then decompose and compare rest
    // else compare blocks
    // this doesn't work because the function is called for each block
    const errorTest = (i: number, v: string, composing: boolean) => {
        if (!word) return false
        const goal = word.kr
        if (!goal) return false
        if (i >= goal.length) return true
        if (i === v.length - 1) {
            if (!composing) {
                if (v[i] !== goal[i]) return true
            } else {
                //... decompose to end? 2 blocks?
                const vjamo = decompose(v[i])
                const gjamo = decompose(goal[i])
                let length = Math.min(vjamo.length, gjamo.length)
                for (let i = 0; i < length; i++) {
                    if (vjamo[i] !== gjamo[i]) return true
                }
                return false
            }
        }
        if (v[i] !== goal[i]) return true
        return false
    }

    return (
        <div
            onMouseDown={(e) => {
                // don't like this but gives best focus experiences
                e.preventDefault()
                inputRef.current?.element()?.focus()
            }}
            className="group relative flex w-full">
            {/* <span className={cn(
                "opacity-1 absolute top-1/2 bottom-1/2 text-front/75 text-3xl font-semibold z-10",
                "transition-opacity",
                "group-focus-within:opacity-0"
            )}> */}
                {/* TODO: mobile "touch to focus" */}
                {/* click or type to focus */}
            {/* </span> */}

            <div className={cn(
                "relative flex flex-col gap-6 w-full items-center",
                "transition-all blur-0",
                "group-focus-within:blur-0"
            )}>
                {
                    displaySettings.showTranslation ?
                        <div className="text-front/60 italic flex justify-center text-xl">
                            {word?.en}
                        </div>
                        :
                        <></>
                }

                <WordSlider
                    onWordChange={onWordChange}
                    ref={sliderRef}
                    wordCount={0} />

                {
                    displaySettings.showDecomposed ?
                        <div className="relative">
                            <div className={cn(
                                "absolute top-0 bottom-0 left-0 right-0 z-50",
                                "border-x border-front/25 opacity-90",
                                "bg-gradient-to-r from-back via-transparent to-back"
                            )} />
                            <HSlider.Container
                                ref={helperRef}
                                className="flex justify-center text-2xl text-front font-bold w-[200px] overflow-clip">
                                {
                                    decomposedWord.map((jamo, i) => (
                                        <span key={jamo + `${i}`}>{jamo}</span>
                                    ))
                                }
                            </HSlider.Container>
                        </div>
                        :
                        <></>
                }

                <Input
                    ref={inputRef}
                    errorTest={errorTest}
                    onChange={onInputChange}
                    onKeyDown={onKeyDown} />
            </div>
        </div>
    )
}


export default Display
