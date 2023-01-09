import { motion, useAnimationControls } from "framer-motion"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import useFocusElementOnKey from "../hooks/useFocusElementOnKey"
import useIntersectionObserver from "../hooks/useIntersectionObserver"
import useHime, { EMPTY_OUTPUT, HimeOutput } from "../lib/hime/hooks/useHime"
import { getRandomFrom, getRandomListFrom } from "../lib/hime/util"
import hangul, { Word } from "../util/hangul"
import { useTTSSettingsStore } from "../util/stores"
import tts from "../util/tts"
import InputText from "./InputText"


const MultiWordMode = () => {
    const inputRef = useRef<HTMLInputElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    // const viewRef = useRef<HTMLDivElement>(null)
    const blockRef = useRef<HTMLDivElement>(null)
    const delCountRef = useRef(0)
    const blockTopRef = useRef(0)

    // TODO: consider useReducer
    const [wordList, setWordList] = useState<Word[]>(getRandomListFrom(hangul.words, 20))
    const [delCount, setDelCount] = useState(0)
    const [index, setIndex] = useState(0)
    const [output, setOutput] = useState<HimeOutput>(EMPTY_OUTPUT)
    const [typedWords, setTypedWords] = useState<string[]>([])

    const blockControls = useAnimationControls()
    const containerControls = useAnimationControls()

    const { ttsEnabled } = useTTSSettingsStore(state => ({
        ttsEnabled: state.enabled
    }))

    useEffect(() => {
        if (containerRef.current) {
            const container = containerRef.current
            const activeWord = containerRef.current.children[index] as HTMLSpanElement
            container.style.height = `${activeWord.clientHeight * 3}px`
            blockTopRef.current = activeWord.getBoundingClientRect().top
        }
    }, [])

    useEffect(() => {
        setIndex(index - delCount)
        setWordList(wordList.slice(delCount))
        setTypedWords(typedWords.slice(delCount))
        console.log('delete', delCountRef)
        delCountRef.current = 0
        console.log('delete')
        // animateLineFeed()
    }, [delCount])

    useEffect(() => {
        if (ttsEnabled) tts.speak(wordList[index].kr, { lang: 'ko-KR', rate: 0.8, force: true })
        animateBlock()
        console.log('index')
    }, [index])

    useEffect(() => {
        animateLineFeed(0)
        console.log('layout effect wordList')
    }, [wordList])

    useHime(inputRef, handleKey)
    useFocusElementOnKey(inputRef)

    function handleKey(e: KeyboardEvent, out: HimeOutput, clear: () => void) {
        if (e.key === ' ') {
            const lastWord = output.blocks + output.composing
            setTypedWords([...typedWords, lastWord])
            setWordList([...wordList, getRandomFrom(hangul.words)])
            setIndex(index + 1)
            setOutput(EMPTY_OUTPUT)
            clear()
        } else if (e.key === "Backspace") {
            // TODO: consider going back
            setOutput(out)
        } else {
            setOutput(out)
        }
    }

    function animateBlock() {
        console.log("animate block")
        const container = containerRef.current
        if (!container) return

        const activeWord = container.children[index] as HTMLSpanElement
        if (!activeWord) return

        const rect = activeWord.getBoundingClientRect()
        blockControls.start({
            left: rect.left,
            top: blockTopRef.current,
            width: rect.width,
            height: rect.height,
            transition: {
                type: 'spring',
                damping: 15,
                mass: 0.9,
                stiffness: 120
            }
        })

        // TODO: animate current jamo indicator same as the current block indicator
    }

    function hideBlock() {
        blockControls.start({
            scale: 0
        })
    }

    function animateLineFeed(i: number) {
        const container = containerRef.current
        const activeWord = containerRef.current?.children[index] as HTMLSpanElement
        if (!activeWord || !container) return

        // container.animate({
        //     top: `${activeWord.clientHeight - activeWord.offsetTop}px`
        // }, {
        //     duration: 150,
        //     fill: 'forwards',
        //     easing: "cubic-bezier(0.22, 1, 0.36, 1)"
        // })
        container.style.top = `${activeWord.clientHeight - activeWord.offsetTop}px`
        // console.log(activeWord.offsetTop)
        // containerControls.start({
        //     top: -56
        // })
    }

    // TODO: find better way
    // something like an event batch, idk
    // a bunch of events fire at the same time
    // I want to count them
    // then run event with the count
    const deleteWord = () => {
        delCountRef.current += 1
        setDelCount(delCountRef.current)
    }

    return (
        <>
            <motion.div ref={blockRef} animate={blockControls} className="absolute px-1 bg-front/10 border-[0.5px] border-front/5 rounded-md"></motion.div>
            <motion.div>
                <motion.div
                    layout="preserve-aspect"
                    className="italic self-center text-front/50 text-center">
                    {wordList[index].en}
                </motion.div>

                <motion.div
                    layout
                    onLayoutAnimationComplete={animateBlock}
                    onLayoutAnimationStart={hideBlock}
                    className="relative overflow-y-hidden rounded-lg">
                    <motion.div
                        layout
                        ref={containerRef}
                        animate={containerControls}
                        className="relative flex flex-wrap items-start">
                        {(
                            wordList.map((word, i) =>
                                <Word
                                    key={word.kr + i}
                                    data={word}
                                    onLeftView={() => deleteWord()}
                                    active={i === index}
                                    typed={i === index ? output.blocks : typedWords[i]} />
                            )
                        )}
                    </motion.div>
                </motion.div>

                <InputText
                    ref={inputRef}
                    blocks={output.blocks}
                    composing={output.composing} />
            </motion.div>
        </>
    )
}

type WordProps = {
    data: Word
    onLeftView: () => void
    typed?: string
    active: boolean
}


// TODO: intersection observer optimizations
const Word = ({ data: word, typed, active, onLeftView }: WordProps) => {
    const ref = useRef<HTMLSpanElement>(null)
    const hasBeenVisible = useRef(false)

    const entry = useIntersectionObserver(ref, { root: ref.current?.parentElement?.parentElement, threshold: 1 })

    useEffect(() => {
        const visible = !!entry?.isIntersecting
        if (hasBeenVisible.current) {
            if (!visible) {
                onLeftView()
            }
        } else {
            hasBeenVisible.current = visible
        }
    }, [entry])

    const syllables = word.kr.split('')

    // TODO: consider conditional classes or something else cause this feels dirty (stitches??? 👀)
    // TODO: circle under active word indicator
    // add circle element to all letters and use framer motion layoutId
    return (
        <>
            <span ref={ref} className={"relative text-4xl font-semibold p-2"}>
                {/* TODO: current block indicator component */}
                {/* {active ?
                    <motion.div
                        layoutId={"current-block-indicator"}
                        className="absolute left-0 right-0 top-0 bottom-0 bg-front/10 border-[0.5px] border-front/5 rounded-md" />
                    :
                    <></>
                } */}
                {
                    active ? (
                        syllables.map((syl, i) => {
                            const className =
                                i > typed!.length ? (
                                    "text-front/30"
                                ) : i === typed!.length ? (
                                    "text-front/70"
                                ) : syl !== typed?.[i] ? (
                                    "text-error"
                                ) : (
                                    "text-front"
                                )

                            return (
                                <div className="relative inline-block">
                                    <span key={syl + i} className={className}>{syl}</span>
                                    {i === typed!.length ?
                                        <motion.span
                                            className="absolute bg-front/80 w-1 h-1 rounded-full top-full left-1/2 -ml-[2px]"
                                            key={`current-indicator`}
                                            layoutId="current-indicator"
                                        />
                                        :
                                        <></>
                                    }
                                </div>
                            )
                        })
                    ) : typed !== undefined ? (
                        syllables.map((syl, i) => {
                            if (syl === typed[i])
                                return <span key={syl + i} className="text-front">{syl}</span>
                            return <span key={syl + i} className="text-error">{syl}</span>
                        })
                    ) : (
                        syllables.map((syl, i) => {
                            return <span key={syl + i} className="text-front/30">{syl}</span>
                        })
                    )
                }
            </span>
        </>
    )
}

export default MultiWordMode