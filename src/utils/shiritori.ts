import { useEffect, useState } from "react";
import dictionary, { DictionaryEntry } from "./dictionary";

interface IShiritoriOptions {

}

export type TShiritori = ReturnType<typeof Shiritori>

const Shiritori = (options?: IShiritoriOptions) => {
    console.log('[shiritori] loaded')
    let chain: DictionaryEntry[] = []

    const init = () => {
        console.log('[shiritori] init')
        chain = [dictionary.Shiritori]

    }

    const destroy = () => {
        chain = []
    }

    const push = (word: string) => {

    }

    return {
        init,
        destroy,
        push,
        chain: () => chain,
    }
}


export function useShiritori() {
    const [shiritori, setShiritori] = useState(Shiritori())

    useEffect(() => {
        shiritori.init()

        return () => {
            shiritori.destroy()
        }
    }, [])

    return shiritori
}

export default Shiritori