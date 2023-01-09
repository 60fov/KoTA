import { useCallback, useState } from "react"
import { HimeInputType } from "./useInputHandler"

const useInputBuffer = () => {
    const [buffer, setBuffer] = useState("")
    const [active, setActive] = useState("")

    const clearBuffer = useCallback(() => {
        setBuffer('')
        setActive('')
    }, [])

    // shoulduseCallback???
    const onInput = (input: HimeInputType) => {
        switch (input.type) {
            case "complete":
                setActive(input.new)
                setBuffer(buffer + input.completed)
                break
            case "delete":
                switch (input.deleteType) {
                    case "char":
                        if (input.key) setActive(input.syllable)
                        else setBuffer(buffer.slice(0, -1))
                        break
                    case "word":
                        if (!input.word) setBuffer(buffer.slice(-1, buffer.lastIndexOf(' ')))
                        else setActive('')
                        break
                    case "line":
                        setBuffer('')
                        setActive('')
                        break
                }
                break
            case "incomplete":
                setActive(input.syllable)
                break
        }
    }

    const output = buffer + active

    return {
        onInput,
        output,
        buffer,
        active,
        clearBuffer
    }


}

export default useInputBuffer