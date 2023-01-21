import { useEffect, useRef, useState } from "react"
import { decompose } from "../lib/hime/jamo"
import { getRandomFrom } from "../lib/hime/util"
import hangul from "../util/hangul"
import HSlider, { HSliderRef } from "./HSlider"

const TestDisplay = () => {
    const slider = useRef<HSliderRef>(null)
    
    const [word, setWord] = useState(getRandomFrom(hangul.words))

    const jamoList = decompose(word.kr)

    const next = () => {
        if (!slider.current) return
        const index = slider.current.getIndex()
        if (index >= jamoList.length - 1) {
            slider.current.setIndex(0)
            setWord(getRandomFrom(hangul.words))
        } else {
            slider.current.next()
        }
    }

    return (
        <div className="flex flex-col gap-12 items-center text-front text-5xl">
            <HSlider.Container ref={slider} className={"flex justify-center overflow-x-clip"}>
                {
                    jamoList.map((jamo, i) => (
                        <span key={jamo + `${i}`}>{jamo}</span>
                    ))
                }
            </HSlider.Container>
            <div className="flex gap-6 justify-center text-xl">
                <button onClick={() => slider.current?.prev()}>prev</button>
                <button onClick={next}>next</button>
            </div>
        </div>
    )
}

export default TestDisplay