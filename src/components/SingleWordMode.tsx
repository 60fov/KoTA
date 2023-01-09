import { useEffect, useRef, useState } from "react"
import { getRandomFrom } from "../lib/hime/util"
import hangul from "../util/hangul"
import useHime, { EMPTY_OUTPUT, HimeKeyEventHandler, HimeOutput } from "../lib/hime/hooks/useHime"
import { useDisplaySettingsStore, useTTSSettingsStore } from "../util/stores"
import tts from "../util/tts"
import InputText from "./InputText"
import useFocusElementOnKey from "../hooks/useFocusElementOnKey"
import { motion } from "framer-motion"

// TODO: clean
// TODO: enter on complete (optional)
// TODO: completion is too abrubt
const SinglWordMode = () => {
    const inputRef = useRef<HTMLInputElement>(null)

    const { showTranslation, showRomanization, showSpaces } = useDisplaySettingsStore(state => ({
        showTranslation: state.showTranslation,
        showRomanization: state.showRomanization,
        showSpaces: state.showSpaces // TODO: show spaces
    }))

    const { ttsEnabled } = useTTSSettingsStore(state => ({
        ttsEnabled: state.enabled
    }))

    const [word, setWord] = useState(getRandomFrom(hangul.words))
    const [output, setOutput] = useState<HimeOutput>(EMPTY_OUTPUT)

    useHime(inputRef, handleKey)
    useFocusElementOnKey(inputRef)

    function handleKey(e: KeyboardEvent, out: HimeOutput, clear: () => void) {
        const combined = (out.blocks + out.composing)
        if (combined === word.kr) {
            setWord(getRandomFrom(hangul.words.filter(v => v != word)))
            clear()
            setOutput(EMPTY_OUTPUT)
        } else {
            setOutput(out)
        }
    }

    useEffect(() => {
        if (ttsEnabled) tts.speak(word.kr, { lang: 'ko-KR', rate: 0.7, force: true })
    }, [word])

    // TODO: romanization function
    const romanization = word.roman
    const outputBlocks = output.blocks.split("")
    const wordBlocks = word.kr.split("")

    // TODO: turn into output component and use it in other modes
    function renderWord(blocksA: string[], blocksB: string[]) {
        return (
            blocksA.map((syl, i) => (
                <span
                    key={syl + i}
                    className={`${i < blocksB.length && syl != blocksB[i] ? "text-error" : "text-front"}`}
                >
                    {syl}
                </span>
            ))
        )
    }

    return (
        // TODO: Stack
        <motion.div
            className="flex flex-col items-center gap-4">
            {showTranslation ?
                <span className="text-base text-front/50">{word.en}</span>
                :
                <></>
            }
            <span className="text-6xl font-semibold p-2">{
                renderWord(wordBlocks, outputBlocks)
            }</span>
            {showRomanization ?
                <span className="text-sm">{romanization}</span>
                :
                <></>
            }
            <InputText ref={inputRef} blocks={output.blocks} composing={output.composing} />
        </motion.div>
    )
}

export default SinglWordMode
