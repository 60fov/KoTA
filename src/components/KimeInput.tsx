import useKime, { KimeInputEvent } from "lib/hooks/useKime"
import { forwardRef, useRef } from "react"
import useSound from "~/hooks/useSound"

import keySfxPath from "@/audio/key.mp3";
import deleteSfxPath from "@/audio/delete.mp3";
import successSfxPath from "@/audio/success.mp3";
import { useEventListener } from "usehooks-ts";


interface KimeInputProps {
    onKeyDown?: (event: KeyboardEvent) => void
    onInput?: (event: KimeInputEvent) => void
    onChange?: (event: Event) => void
}

interface IKimeInput extends HTMLInputElement {

}

const KimeInput = forwardRef<HTMLInputElement, KimeInputProps>((props, ref) => {
    const refInput = useRef<HTMLInputElement>(null)

    syncRefs: {
        if (!ref) break syncRefs
        if (typeof ref === 'function') {
            ref(refInput.current)
        } else if (ref) {
            ref.current = refInput.current;
        }
    }

    const kinput = useKime(refInput)

    const keySfx = useSound(keySfxPath)
    const deleteSfx = useSound(deleteSfxPath)


    // focus input on no-focus key press
    useEventListener('keydown', (event) => {
        if (document.activeElement == document.body) {
            refInput.current?.focus()
        }
    })

    // sfx
    useEventListener('keydown', (event) => {
        if (event.key.length === 1 && event.key !== ' ') {
            void keySfx.play({ force: true })
        } else if (event.key === 'Backspace') {
            void deleteSfx.play({ force: true })
        }
    }, refInput)

    if (props.onKeyDown) useEventListener('keydown', props.onKeyDown, refInput)
    if (props.onInput) useEventListener('kimeinput', props.onInput, refInput)
    if (props.onChange) useEventListener("change", props.onChange, refInput)

    return (
        <div
            style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                height: 36,
                gap: 'var(--spacing-md)',
                justifyContent: "center",
                padding: 'var(--spacing-sm) var(--spacing-md)',
                boxSizing: 'content-box',
            }}>
            <input ref={refInput} type="text" style={{
                width: "1px",
                height: "1px",
                clip: "rect(0 0 0 0)",
                clipPath: "inset(50%)",
                overflow: "hidden",
                position: "absolute",
                whiteSpace: "nowrap",
            }} />
            <span style={{
                color: 'var(--color-front-100)',
                fontSize: 36,
                fontWeight: 600
            }}>{kinput.value}</span>
            <div style={{
                transition: "all 150ms ease-in-out",
                position: 'absolute',
                left: '100%',
                transform: 'translateX(-100%)',
                height: kinput.hasFocus ? "100%" : 0,
                width: 4,
                background: 'var(--color-front-100)',
                animation: 'cursor 1s infinite alternate'
            }} />
        </div>
    )
})

export default KimeInput