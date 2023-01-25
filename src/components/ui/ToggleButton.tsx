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
                "group relative p-3 transition-all duration-150",
                "text-front/50 bg-back-alt/60",
                "border-[0.5px] border-front/10 rounded-md",
                "focus-visible:outline outline-access outline-1",
                "hover:text-front/90 hover:border-front/20 bg-back-alt/75",
                "data-[state=on]:text-front/75",
                // "data-[state=on]:text-front data-[state=on]:bg-back-alt/60 data-[state=on]:border-front/10",
                className)}
            type="button"
            data-state={pressedProp === undefined || pressed ? 'on' : 'off'}
            onClick={() => {
                setPressed(!pressed)
                onToggle(!pressed) // TODO: do in use effect?
            }}
        >
            <div className={cn(
                "absolute top-[2px] left-[2px] right-[2px] bottom-[2px]",
                "bg-back rounded border-front/5 border-[0.5px] shadow-md",
                "transition-all ease-in-out duration-150",
                "scale-0 group-data-[state=on]:scale-100",
            )}>
            </div>
            <div className="relative z-10">
                {children}
            </div>
        </button>
    )
}

export default ToggleButton