import { useModeStore } from "../util/stores"
// import JamoMode from "./JamoMode"
// import MultiWordMode from "./MultiWordMode"
// import SingleWordMode from "./SingleWordMode"
import TestMode from "./TestMode"

const ModeDisplay = () => {
    const mode = useModeStore((state) => state.mode)

    return <TestMode />
    // switch (mode) {
    //     case "jamo":
    //         return <JamoMode />
    //     case "word":
    //         return <SingleWordMode />
    //     case "multi-word":
    //         return <MultiWordMode />
    // }
}

export default ModeDisplay