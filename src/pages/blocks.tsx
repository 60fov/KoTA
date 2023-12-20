import { useEffect, useReducer, useState } from "react";
import Dynamic from "~/components/Dynamic";
import RootLayout from "~/components/layouts/RootLayout";
import Spacer from "~/components/ui/Spacer";
import { TWord, Dict } from "~/utils/dictionary";
import { cn, random } from "~/utils/fns";


import styles from "./Vocab.module.scss";
import Button from "~/components/ui/Button";
import RadixIcons from "~/components/icons/RadixIcons";
import { HTMLMotionProps, motion } from "framer-motion";

const SYLLABLE_CHOICE_COUNT = 12

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

    useEffect(() => {
        console.log(state)
    }, [state])

    useEffect(() => {
        //TODO
    }, [state.word])

    // useEffect(() => {
    //     if (!word) return
    //     const guessStr = guess.reduce((accum, guess) => accum += guess.str, "")
    //     console.log(guessStr, word.kr)
    //     if (guessStr === word.kr) setWord(Dict.getRandomWord())
    // }, [guess])

    // TODO better pattern
    // if (!word || !syllables) {

    //     console.log(word, syllables)
    //     return <div>loading...</div>
    // }


    function handleSyllableClick(i: number) {
        dispatch({ type: "SyllableClick", index: i })
    }

    function handleInputBlockClick(i: number) {
        dispatch({ type: "InputBlockClick", index: i })
    }

    useEffect(() => {
        const guess = state.guess.map(syl => syl.str).join("")
        if (guess === state.word.kr) {
            dispatch({ type: "Solved" })
        }
    }, [state.guess])

    return (
        <Dynamic>
            <motion.div className={styles.base}>
                <VocabImage word={state.word} />
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


function VocabImage(props: { word: TWord }) {
    // https://source.unsplash.com/random?${props.word.en}
    // const [imgUrl, setImgUrl] = useState(`https://www.bluebonnetmotors.net/blogs/3375/wp-content/uploads/2020/11/2-1.jpg`)



    return (
        // <div className="w-64 bg-[var(--color-back-alt-100)] [border:var(--border)] shadow-md p-1 rounded-xl">
        //     <img className="w-full object-cover rounded-lg" src={imgUrl} alt={`${props.word.en}`} />
        // </div>
        <div>
            <span className="text-4xl tracking-tight font-semibold text-[var(--color-front-90)]">
                {props.word.en}
            </span>
        </div>

    )
}


function GuessSlots(props: { state: State, onClick: (i: number) => void }) {
    const {
        state
    } = props

    const [showVariant, setShowVariant] = useState(false)

    useEffect(() => {
        if (state.guess.length === state.word.kr.length) {
            setShowVariant(true)
        } else {
            setShowVariant(false)
        }
    }, [state.guess])

    return (
        <div className="flex gap-2 h-20">
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
                    <div key={`${wordSyllableStr}`}>
                        {guessSyllable &&
                            <SylBlock
                                key={`${guessSyllable.id}`}
                                syl={guessSyllable}
                                // style={{ rotate }}
                                variant={showVariant ? variant : "default"}
                                onClick={() => props.onClick(i)}
                            />
                        }
                    </div>
                )
            })}
        </div>
    )
}


// TODO doesnt support words longer that the length prop
function VocabSyls(props: { state: State, onClick: (i: number) => void }) {
    const {
        state
    } = props

    return (
        <div className="flex justify-center gap-2 flex-wrap w-full max-w-sm">
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
