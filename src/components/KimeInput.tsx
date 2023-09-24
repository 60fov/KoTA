import { type TKime } from "lib/hooks/useKime"
import { forwardRef } from "react"

import styles from "./KimeInput.module.scss";

interface KimeInputProps {
    kime: TKime
    renderFn?: (kime: TKime) => React.ReactNode
}

const KimeInput = forwardRef<HTMLInputElement, KimeInputProps>(function KimeInput(props, ref) {

    // TODO use kime prop more
    return (
        <div
            className={styles.base}>
            <input data-input ref={ref} type="text" />
            <span data-output>{props.renderFn ? props.renderFn(props.kime) : props.kime.value}</span>
            <div data-caret />
        </div>
    )
})

export default KimeInput