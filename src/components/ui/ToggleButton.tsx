import { ReactNode, useState } from "react";
import { cn } from "../../util/css";

interface Props {
    pressed?: boolean
    onToggle?: (pressed: boolean) => void
    className?: string
    children?: ReactNode
}

const ToggleButton = ({ pressed: pressedProp, onToggle = () => ({}), children, className = "" }: Props) => {
    const [pressed, setPressed] = useState(pressedProp);

    return (
        <button
            className={cn(
                "p-3 transition-all duration-300 rounded-md text-front/30",
                "border-[0.5px] border-front/5",
                "focus-visible:outline outline-access outline-1",
                "data-[state=on]:text-front data-[state=on]:bg-back-alt/60 data-[state=on]:border-front/10",
                "hover:bg-back-alt/30 hover:text-front/50 hover:border-front/10",
                "hover:data-[state=on]:border-front/10 hover:data-[state=on]:bg-back-alt/40",
                className)}
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