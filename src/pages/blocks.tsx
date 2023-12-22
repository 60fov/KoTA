import { useEffect, useReducer, useState } from "react";
import Dynamic from "~/components/Dynamic";
import RootLayout from "~/components/layouts/RootLayout";
import Spacer from "~/components/ui/Spacer";
import { TWord, Dict } from "~/utils/dictionary";
import { cn, random } from "~/utils/fns";


import styles from "./Vocab.module.scss";
import Button from "~/components/ui/Button";
import RadixIcons from "~/components/icons/RadixIcons";
import { HTMLMotionProps, Variant, motion, useAnimation } from "framer-motion";
import useTTS from "~/hooks/useTTS";

import tts from "~/utils/tts";
import useSound from "~/hooks/useSound";

import keySfxPath from "@/audio/keyAlt.mp3";
import deleteSfxPath from "@/audio/delete.mp3";
import successSfxPath from "@/audio/success.mp3";
import errorSfxPath from "@/audio/error.mp3";


const SYLLABLE_CHOICE_COUNT = 10

type TSyllable = {
    str: string
    id: string
}

type State = {
    word: TWord
    syllables: TSyllable[]
    guess: TSyllable[]
    solved: boolean
}

type Action = {
    type: "SyllableClick"
    index: number
} | {
    type: "InputBlockClick"
    index: number
} | {
    type: "Solved"
} | {
    type: "NewWord"
    word?: TWord
} | {
    type: "Shuffle"
}

function initialState(word: TWord): State {
    const syllables = random.shuffle([
        ...word.kr.split(""),
        ...Dict.getRandomSyllables(SYLLABLE_CHOICE_COUNT - word.kr.length)
    ]).map((syl) => ({ id: random.nano(), str: syl }))

    return {
        word,
        syllables,
        guess: [],
        solved: false,
    }
}

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "SyllableClick": {
            // careful w/ nested objs
            const clickedSyllable = state.syllables[action.index]
            if (!clickedSyllable) {
                console.error("click'd undefined syllable (panic!!!)");
                return state;
            }

            if (state.guess.includes(clickedSyllable)) {
                console.log("click'd already clicked syllable");
                return state;
            }

            const guess = [...state.guess]
            const syllables = [...state.syllables]

            if (state.guess.length < (state.word.kr.length || 0)) {
                guess.push(clickedSyllable)
            }

            return {
                ...state,
                guess,
                syllables,
            }
        }

        case "InputBlockClick": {
            const guess = state.guess.slice(0, action.index)

            // TODO select

            return {
                ...state,
                guess
            }
        }

        case "Solved": {
            return {
                ...state,
                solved: true
            }
        }

        case "NewWord": {
            return initialState(action.word || Dict.getRandomWord())
        }

        case "Shuffle": {
            const syllables = random.shuffle(state.syllables)
            return {
                ...state,
                syllables
            }
        }

        // default: {
        //     throw new Error(`unhandled ui action type: ${action.type}`);
        // }
    }
}

function BlocksPage() {
    const [state, dispatch] = useReducer(reducer, Dict.getRandomWord(), initialState)

    const ttsEn = useTTS({ lang: "en-US", rate: 1 })
    const ttsKo = useTTS({ lang: "ko-KR", rate: 1 })

    const successSfx = useSound(successSfxPath)
    const deleteSfx = useSound(deleteSfxPath)
    const keySfx = useSound(keySfxPath)
    const errorSfx = useSound(errorSfxPath)

    useEffect(() => {
        // console.log(state)
    }, [state])


    function handleSyllableClick(i: number) {
        dispatch({ type: "SyllableClick", index: i })
        const syl = state.syllables[i]
        if (!syl) {
            return
        }
        ttsKo(`${syl.str}`, { force: true })
        void keySfx.play({ force: true })
    }

    function handleInputBlockClick(i: number) {
        dispatch({ type: "InputBlockClick", index: i })
        void deleteSfx.play({ force: true })
    }

    useEffect(() => {
        const guess = state.guess.map(syl => syl.str).join("")
        if (guess === state.word.kr) {
            dispatch({ type: "Solved" })
            void successSfx.play({ force: true })
            // ttsKo(state.word.kr)
            // ttsEn(state.word.en)
        }
    }, [state.guess])

    return (
        <Dynamic>
            <motion.div className={styles.base}>
                <VocabImage state={state} word={state.word} />
                <Spacer.Row size={64} />
                <GuessSlots state={state} onClick={handleInputBlockClick} />
                <Spacer.Row size={64} />
                <VocabSyls state={state} onClick={handleSyllableClick} />
                <Spacer.Row size={32} />
                <div className="flex gap-2 items-center">
                    <Button
                        variant="default"
                        prefix={<RadixIcons.Reload />}
                        onClick={() => dispatch({ type: "Shuffle" })}
                    >shuffle</Button>
                    <Button
                        disabled={!state.solved}
                        variant="default"
                        suffix={<RadixIcons.ArrowRight />}
                        onClick={() => dispatch({ type: "NewWord" })}
                    >next</Button>
                </div>
            </motion.div>
        </Dynamic>
    )
}


BlocksPage.getLayout = RootLayout;

export default BlocksPage;


function VocabImage(props: { state: State, word: TWord }) {
    // https://source.unsplash.com/random?${props.word.en}
    // const [imgUrl, setImgUrl] = useState(`https://www.bluebonnetmotors.net/blogs/3375/wp-content/uploads/2020/11/2-1.jpg`)


    return (
        // <div className="w-64 bg-[var(--color-back-alt-100)] [border:var(--border)] shadow-md p-1 rounded-xl">
        //     <img className="w-full object-cover rounded-lg" src={imgUrl} alt={`${props.word.en}`} />
        // </div>
        <div className="flex flex-col gap-4 items-center">
            <span className="text-4xl tracking-tight font-semibold text-[var(--color-front-90)]">
                {props.word.en}
            </span>
            <span className="text-xl h-7 tracking-tight text-[var(--color-front-alt-100)] italic">
                {props.state.solved && props.word.rm}
            </span>
        </div>

    )
}


function GuessSlots(props: { state: State, onClick: (i: number) => void }) {
    const {
        state
    } = props

    const [showVariant, setShowVariant] = useState(false)

    const controls = useAnimation();


    const containerVariants: Record<string, Variant> = {
        initial: {
            scale: 1,
            rotate: 0,
        },
        success: {
            transition: {
                duration: 0.1,
                ease: 'easeInOut',
                delayChildren: 0.1,
                staggerChildren: 0.1
            }
        }
    }

    const sylVariants: Record<string, Variant> = {
        initial: {
            translateY: 0
        },
        success: {
            translateY: [-15, -10, -15, -10, -15]
        }
    }

    useEffect(() => {
        if (state.guess.length === state.word.kr.length) {
            setShowVariant(true)
        }

        const guess = state.guess.reduce((accum, syl) => accum += syl.str, "")

        if (guess === state.word.kr) {
            void controls.start('success')
                .then(() => controls.start('initial'))
        }
    }, [state.guess])

    useEffect(() => {
        setShowVariant(false)
    }, [state.word])

    return (
        <div className="flex flex-col gap-2 items-center">
            <motion.div
                variants={containerVariants}
                initial="initial"
                animate={controls}
                exit="initial"
                className="flex  gap-2 h-16">
                {state.word.kr.split("").map((wordSyllableStr, i) => {
                    const guessSyllable = state.guess[i]
                    let variant: SyllableBlockVariant = "default"
                    // TODO set variant on guess full, clear when guess not full
                    if (!guessSyllable) {
                        variant = "slot"
                    } else if (guessSyllable.str === wordSyllableStr) {
                        variant = "correct"
                    } else if (state.word.kr.includes(guessSyllable.str)) {
                        variant = "misplaced"
                    } else if (showVariant) {
                        variant = "incorrect"
                    }

                    // const rotate = random.float(-15, 15)

                    return (
                        <motion.div
                            variants={sylVariants}
                            key={`${wordSyllableStr}`}>
                            {guessSyllable &&
                                <SylBlock
                                    key={`${guessSyllable.id}`}
                                    syl={guessSyllable}
                                    // style={{ rotate }}
                                    variant={showVariant ? variant : "default"}
                                    onClick={() => props.onClick(i)}
                                />
                            }
                        </motion.div>
                    )
                })}
            </motion.div>
            <div className="flex gap-2">
                {
                    state.word.kr.split("").map((kr, i) => (
                        <div
                            key={`${kr}-${i}`}
                            data-active={state.guess.length - 1 < i}
                            className="w-2 h-2 bg-[var(--color-front-100)] data-[active=true]:bg-[var(--color-front-alt-50)] rounded-full"
                        />
                    ))
                }
            </div>
        </div >
    )
}


// TODO doesnt support words longer that the length prop
function VocabSyls(props: { state: State, onClick: (i: number) => void }) {
    const {
        state
    } = props

    return (
        <div className="flex justify-center gap-2 flex-wrap w-full max-w-xs">
            {state.syllables.map((syl, i) => {
                const selected = state.guess.includes(syl)
                return (
                    <div className="relative" key={`${syl.id}`}>
                        <SylBlock
                            syl={syl}
                            layoutId={undefined}
                            variant={"selected"}
                        />
                        {!selected &&
                            <div className="absolute inset-0">
                                <SylBlock
                                    // key={`${syl.id}`}
                                    syl={syl}
                                    variant={"default"}
                                    onClick={() => props.onClick(i)}
                                />
                            </div>
                        }
                    </div>
                )
            })}
        </div>
    )
}

type SyllableBlockVariant =
    "default" | "selected" | "slot" | "correct" | "incorrect" | "misplaced"

function SylBlock(props:
    & HTMLMotionProps<"div">
    & {
        syl: TSyllable,
        variant: SyllableBlockVariant
    }
) {
    const {
        syl,
        variant,
        ...restProps
    } = props

    return (
        <div>
            <motion.div
                layoutId={`layout-${syl.id}`}
                transition={{ type: "spring", damping: 3, mass: 0.1, stiffness: 50 }}
                // transition={{ ease: "easeInOut", duration: 0.1 }}
                {...restProps}
                data-variant={variant}
                className={styles.syllableBlock}>
                <span data-text>{props.syl?.str}</span>
            </motion.div>
        </div>
    )
}
