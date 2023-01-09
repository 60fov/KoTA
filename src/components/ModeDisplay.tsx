import { useModeStore } from "../util/stores"
import JamoMode from "./JamoMode"
import MultiWordMode from "./MultiWordMode"
import SingleWordMode from "./SingleWordMode"

const ModeDisplay = () => {
    const mode = useModeStore((state) => state.mode)

    switch (mode) {
        case "jamo":
            return <JamoMode />
        case "word":
            return <SingleWordMode />
        case "multi-word":
            return <MultiWordMode />
    }
}

export default ModeDisplay