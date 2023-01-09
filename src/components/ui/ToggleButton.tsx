import { ReactNode, useState } from "react";

interface Props {
    pressed?: boolean
    onToggle?: (pressed: boolean) => void
    className?: string
    children?: ReactNode
}

const ToggleButton = ({ pressed: pressedProp, onToggle = () => ({}), children, className="" }: Props) => {
    const [pressed, setPressed] = useState(pressedProp);

    return (
        <button
            className={`p-3 transition-all duration-300 text-front/30 rounded-md border-[0.5px] border-front/0 focus:outline outline-access outline-1 hover:bg-back-alt/30 hover:text-front/50 data-[state=on]:text-front data-[state=on]:bg-back-alt/60 hover:data-[state=on]:bg-back-alt/40 data-[state=on]:border-front/5 ${className}`}
            type="button"
            data-state={pressedProp === undefined || pressed ? 'on' : 'off'}
            onClick={() => {
                setPressed(!pressed)
                onToggle(!pressed) // TODO: do in use effect?
            }}
        >
            {children}
        </button>
    )
}

export default ToggleButton