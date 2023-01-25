import { motion, useInView, useSpring } from "framer-motion"
import { forwardRef, RefObject, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from "react"
import { decompose } from "../lib/hime/jamo"
import { getRandomFrom, getRandomListFrom } from "../lib/hime/util"
import { cn } from "../util/css"
import hangul, { Word } from "../util/hangul"


// TODO: audit
// TODO: take word list as option before oting for random
// TODO: make line slider component (or this multipurpose, but probably not)

interface Props {
    wordCount: number
    onWordChange?: (word: Word) => void
    className?: string
}

export interface WordSliderRef {
    prev: () => void
    next: () => void
    submit: (word: string) => boolean
    word: () => Word
}

const WordSlider = forwardRef<WordSliderRef, Props>((props, ref) => {
    const { wordCount, onWordChange, ...restProps } = props
    const sliderRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const prevOffsetRef = useRef(0)

    const [wordList, setWordList] = useState<Word[]>(getRandomListFrom(hangul.words, 10))
    const [wordIndex, setWordIndex] = useState(0)
    const word = wordList[wordIndex]

    const offset = useSpring(0, {
        damping: 20,
        mass: 0.5,
        stiffness: 180
    })
    const width = useSpring(0, {
        damping: 12,
        mass: 0.5,
        stiffness: 180
    })

    useLayoutEffect(() => {
        if (sliderRef.current === null) return
        const element = sliderRef.current.children[wordIndex] as HTMLDivElement
        if (!element) return

        const offsetOld = prevOffsetRef.current
        const offsetNew = -element.offsetLeft
        if (offsetOld < offsetNew) {
            const offsetDiff = offsetOld - offsetNew
            offset.jump(offset.get() - offsetDiff)
        }

        offset.set(offsetNew)
        width.set(element.clientWidth)

        prevOffsetRef.current = offsetNew
    }, [wordList, wordIndex])

    useEffect(() => {
        if (onWordChange) onWordChange(word)
    }, [word])

    const removeWord = (index: number) => {
        setWordList(wordList.filter((_, i) => i !== index))
        setWordIndex(wordIndex - 1)
    }

    useImperativeHandle(ref, () => {
        return {
            word() {
                return word
            },
            prev() {
                if (wordIndex > 0) setWordIndex(wordIndex - 1)
            },
            next() {
                setWordList([...wordList, getRandomFrom(hangul.words)])
                setWordIndex(wordIndex + 1)
            },
            submit(word: string) {
                return false
            }
        }
    })

    return (
        <div className="flex flex-col gap-6 w-full" {...restProps}>
            {/* TODO: move this to display (maybe) */}
            
            <div ref={containerRef} className="relative flex justify-center overflow-x-clip">
                <div className={cn(
                    "absolute top-0 bottom-0 left-0 right-0 z-50",
                    "border-x border-front/25 opacity-90",
                    "bg-gradient-to-r from-back via-transparent to-back"
                )} />
                <motion.div
                    className={cn('relative p-1 box-content border-[0.5px] border-front/25 rounded bg-front/5')}
                    style={{ width }}>
                    <motion.div
                        ref={sliderRef}
                        style={{ x: offset }}
                        className={'relative flex gap-3'}>
                        {
                            wordList.map((word, i) => (
                                <Word
                                    key={word.kr + `${i}`}
                                    word={word}
                                    root={containerRef}
                                    onViewLeave={() => removeWord(i)}
                                />
                            ))
                        }
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
})

interface WordProps {
    word: Word
    root: RefObject<HTMLElement>
    onViewLeave: () => void
}

const Word = (props: WordProps) => {
    const { root, word, onViewLeave } = props

    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { root, margin: "0px 0px 0px 500px" })

    useEffect(() => {
        if (!ref.current || !root.current) return
        const wordRect = ref.current.getBoundingClientRect()
        const rootRect = root.current.getBoundingClientRect()
        if (wordRect.right < rootRect.left) onViewLeave()
    }, [isInView])


    return (
        <div
            ref={ref}
            className={cn(
                "text-4xl text-front font-semibold whitespace-nowrap"
            )}>
            {word.kr}
        </div>
    )
}

export default WordSlider