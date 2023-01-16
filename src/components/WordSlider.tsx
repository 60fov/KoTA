import { motion, useInView, useSpring } from "framer-motion"
import { forwardRef, RefObject, useEffect, useImperativeHandle, useRef, useState } from "react"
import { getRandomFrom, getRandomListFrom } from "../lib/hime/util"
import { cn } from "../util/css"
import hangul, { Word } from "../util/hangul"

// TODO: take word list as option before oting for random
// TODO: make line slider component (or this multipurpose, but probably not)

interface Props {
    wordCount: number
    className?: string
    // direction?: 'row' | 'column'
}

export interface WordSliderHandle {
    prev: () => void
    next: () => void
    submit: (word: string) => boolean
    word: () => Word
}

const WordSlider = forwardRef<WordSliderHandle, Props>((props, ref) => {
    const { wordCount, ...restProps } = props
    const sliderRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const prevOffsetRef = useRef(0)

    const [wordList, setWordList] = useState<Word[]>(getRandomListFrom(hangul.words, 10))
    const [wordIndex, setWordIndex] = useState(0)
    const word = wordList[wordIndex]

    const offset = useSpring(0, {
        damping: 15,
        mass: 0.5,
        stiffness: 180
    })
    const width = useSpring(0, {
        damping: 12,
        mass: 0.5,
        stiffness: 180
    })

    useEffect(() => {
        if (sliderRef.current === null) return
        const element = sliderRef.current.children[wordIndex] as HTMLDivElement
        if (!element) return

        const offsetOld = prevOffsetRef.current
        const offsetNew = -element.offsetLeft
        if (offsetOld < offsetNew) {
            const offsetDiff = offsetOld - offsetNew
            // console.log(offsetDiff)
            offset.jump(offset.get() - offsetDiff)
        }

        offset.set(offsetNew)
        width.set(element.clientWidth)

        prevOffsetRef.current = offsetNew
    }, [wordList, wordIndex])

    const removeWord = (index: number) => {
        setWordList(wordList.filter((word, i) => i !== index))
        setWordIndex(wordIndex - 1)

        const element = sliderRef.current?.children[wordIndex] as HTMLDivElement
        if (!element) return
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

    // const height = element?.clientHeight || 'unset'
    // const offset = dir === 'row' ? element?.

    return (
        <div className="flex flex-col" {...restProps}>
            <div className="text-front/50 italic flex justify-center pb-6">{word.en}</div>
            <div ref={containerRef} className="relative w-[700px] flex justify-center overflow-x-clip">
                <div className={cn(
                    "absolute top-0 bottom-0 left-0 right-0 z-50",
                    "border-x border-front/25 opacity-90",
                    "bg-gradient-to-r from-back via-transparent to-back"
                )} />
                <motion.div
                    className={cn('relative w-0')}
                    style={{ width }}
                >
                    <motion.div
                        style={{ width }}
                        className={cn(
                            "absolute -top-1 -bottom-1 -left-1 px-1 box-content",
                            "border-[0.5px] border-front/25 rounded bg-front/5"
                        )} />
                    <motion.div
                        ref={sliderRef}
                        style={{ x: offset }}
                        className={cn(
                            'relative flex gap-3',
                            // dir === 'column' ? 'flex-col' : 'flex-row'
                        )}>
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
    const isInView = useInView(ref, { root })
    const [wasInView, setWasInView] = useState(false)

    useEffect(() => {
        // console.log('is in view?', isInView)
        if (!wasInView) setWasInView(isInView)
        else if (!isInView) onViewLeave()
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