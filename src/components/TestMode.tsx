import { motion, useSpring } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import useFocusElementOnKey from "../hooks/useFocusElementOnKey"
import useHime from "../lib/hime/hooks/useHime"
import { getRandomFrom, getRandomListFrom } from "../lib/hime/util"
import { cn } from "../util/css"
import hangul, { Word } from "../util/hangul"
import Input from "./Input"
import WordSlider, { WordSliderHandle } from "./WordSlider"

const SinglWordMode = () => {
    const sliderRef = useRef<HTMLDivElement>(null)
    const wordRef = useRef<HTMLDivElement>(null)
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

        if (e.key === 'ArrowLeft') slider.prev()
        if (e.key === 'ArrowRight') slider.next()

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

    function clearInput() {
        setInput('')
        if (inputRef.current) inputRef.current.value = ''
    }

    return (
        <motion.div className="flex flex-col items-center gap-6">
            <WordSlider
                ref={wordSliderRef}
                wordCount={5} />
            {/* <ElementSlider.Container index={wordIndex}>
                {
                    wordList.map((word, i) => (
                        <ElementSlider.Element
                            key={word.kr + `${i}`}>
                            <div
                                className={cn(
                                    "text-4xl text-white font-semibold whitespace-nowrap"
                                )}>
                                {word.kr}
                            </div>
                        </ElementSlider.Element>
                    ))
                }
            </ElementSlider.Container> */}
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

interface InputDisplayProps {
    input: string
    focused: boolean
}

const InputDisplay = (props: InputDisplayProps) => {
    const { input, focused, ...restProps } = props

    const ch = useSpring(0, {
        stiffness: 150,
        damping: 10,
        mass: 0.5
    })

    useEffect(() => {
        if (focused) ch.set(1)
        else ch.set(0)
    }, [focused])

    return (
        <div className="relative flex">
            <div className={cn(
                "h-12",
                "text-white text-5xl font-semibold")}>
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
                className="absolute -right-2 h-12 translate-x-full w-1 bg-white rounded-sm" />
        </div>
    )

}

export default SinglWordMode
