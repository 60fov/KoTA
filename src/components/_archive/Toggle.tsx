import type { ReactNode } from "react";
import { useState } from "react";
import { cn } from "~/utils/fns";
import { type CSSVariableProperties } from "~/utils/types";

interface Props {
  pressed?: boolean
  onToggle?: (pressed: boolean) => void
  className?: string
  children?: ReactNode
}

const Toggle = ({ pressed: pressedProp, onToggle = () => ({}), children, className = "" }: Props) => {
  const [pressed, setPressed] = useState(pressedProp);

  return (
    <button
      style={{ "--spacing": "2px" } as CSSVariableProperties}
      className={cn(
        "group relative transition-all duration-150",
        "p-v box-content",
        "text-front/50 bg-back-alt/75 border-[0.5px] border-front/10 rounded-md outline-access outline-1 outline-offset-2",
        "focus-visible:outline",
        "hover:text-front/90 hover:border-front/20",
        "data-[state=on]:text-front/50",
        className)}
      type="button"
      data-state={pressedProp ?? pressed ? 'on' : 'off'}
      onClick={() => {
        setPressed(!pressed)
        onToggle(!pressed) // TODO: do in use effect? (this could force a second render)
      }}
    >
      <div className={cn(
        "absolute transition-all ease-in-out duration-300",
        "top-v left-v right-v bottom-v",
        "bg-back rounded scale-0 border-front/5 border-[0.5px] shadow-md",
        "group-data-[state=on]:scale-100",
      )}>
      </div>
      <div className="relative w-8 h-8 z-10 flex items-center justify-center">
        {children}
      </div>
    </button>
  )
}

export default Toggle