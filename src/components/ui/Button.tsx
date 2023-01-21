import { ReactNode, useState } from "react";
import { cn } from "../../util/css";

interface Props {
    className?: string
    onClick?: (e: MouseEvent) => void
    children?: ReactNode
}

const Button = (props: Props) => {
    const { children, className = "", onClick = () => { }, ...restProps } = props

    return (
        <button
            {...restProps}
            className={cn(
                "px-2 py-1 transition-all duration-300 rounded-md text-front/30",
                "border-[0.5px] border-front/20",
                "focus-visible:outline outline-access outline-1",
                "active:text-front active:bg-back-alt/60 active:border-front/50",
                "hover:bg-back-alt/30 hover:text-front/50",
                className)}
            type="button"
        >
            {children}
        </button>
    )
}

export default Button