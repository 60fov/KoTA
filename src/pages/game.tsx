import KeyboardDisplay from "~/components/KeyboardDisplay";
import Dynamic from "~/components/Dynamic";
import RootLayout from "~/components/layouts/RootLayout";
import { type NextPageWithLayout } from "./_app";
import { useRef } from "react";
import useKime from "lib/hooks/useKime";
import { useShiritori } from "~/utils/shiritori";
import { useSock } from "~/utils/sock";
import Slider from "~/components/ui/Slider";
import { useEventListener } from "usehooks-ts";


const SERVER_URL = new URL("ws://localhost:9001")

const Game: NextPageWithLayout = () => {
    return (
        <div className="h-screen flex flex-col items-center gap-16">
            <div className="h-1/2 w-[90%] max-w-6xl flex flex-col items-center justify-end">
                <Dynamic>
                    <Gamemode />
                </Dynamic>
            </div>
            <div className="h-1/2">
                <Dynamic>
                    <KeyboardDisplay />
                </Dynamic>
            </div>
        </div>
    );
};

Game.getLayout = RootLayout;

export default Game;



// GAMEMODE
function Gamemode() {
    const shiritori = useShiritori()
    const sock = useSock(SERVER_URL, (e) => {

    })

    const refInput = useRef<HTMLInputElement>(null)

    const kime = useKime(refInput)
    const chain = shiritori.chain()

    useEventListener('keydown', (e) => {
        if (!refInput.current) return
        if (document.activeElement === document.body) refInput.current.focus()
    })

    useEventListener('keydown', (e) => {
        if (e.key === "Enter") shiritori.push(kime.value)
    }, refInput)

    return (
        <>
            <div className="relative flex">
                <div className="relative right-full flex">
                    {chain.map((word) =>
                        <span className="[writing-mode:vertical-lr]" key={word.kr}>{word.kr}</span>
                    )}
                </div>
                <div>
                    <span className="[writing-mode:vertical-rl]">{kime.value}</span>
                </div>
            </div>

            <input ref={refInput} className={"[clip:rect(0,0,0,0)] [clip-path:inset(50%) overflow-hidden absolute"} />
        </>
    )
}

