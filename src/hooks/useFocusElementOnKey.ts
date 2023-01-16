import { RefObject, useEffect } from "react"

const useFocusElementOnKey = (ref: RefObject<HTMLElement>) => {
    // TODO: explore more semantically correct options (event propagation/capture?)
    const onKeyUp = (e: KeyboardEvent) => {
        const nothingFocused = e.target === document.body
        const modKey = e.altKey || e.metaKey || e.ctrlKey || e.shiftKey
        const focusInteractionKey = e.key === ' ' || e.key === 'Enter' || e.key === 'Tab' ||
            e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight'
        if (nothingFocused) {
            if (!modKey && !(e.key === 'Tab')) ref.current?.focus()
        } else {
            if (!focusInteractionKey && !modKey) ref.current?.focus()

        }
    }

    useEffect(() => {
        window.addEventListener('keyup', onKeyUp)
        return () => {
            window.removeEventListener('keyup', onKeyUp)
        }
    }, [])
}

export default useFocusElementOnKey