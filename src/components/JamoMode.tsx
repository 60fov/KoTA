import { useRef, useState } from "react"
import { getRandomFrom } from "../lib/hime/util"
import hangul from "../util/hangul"
import useHime, { HimeKeyEventHandler } from "../lib/hime/hooks/useHime"
import InputText from "./InputText"
import useFocusElementOnKey from "../hooks/useFocusElementOnKey"
import { motion } from "framer-motion"


// TODO: decompose active block for error display
const JamoMode = () => {
    const [jamo, setJamo] = useState(getRandomFrom(hangul.singleJamo))
    const [block, setBlock] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)

    const handleKey: HimeKeyEventHandler = (e, out, clear) => {
        setBlock(out.jamo || '')
        if (out.jamo && out.jamo === jamo) {
            setJamo(getRandomFrom(hangul.singleJamo.filter(v => v != out.jamo)))
            setBlock('')
        }
    }

    useHime(inputRef, handleKey)

    useFocusElementOnKey(inputRef)

    return (
        // TODO: display name of jamo (optional)
        // TODO: Stack
        <motion.div
            className="flex flex-col items-center gap-4">
            <span className="text-5xl font-semibold text-front">{jamo}</span>
            <InputText ref={inputRef} blocks={block} composing={""} />
        </motion.div>
    )
}

export default JamoMode