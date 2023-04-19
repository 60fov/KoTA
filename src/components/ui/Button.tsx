<<<<<<< HEAD
import { type ReactNode } from "react";
import { cn } from "~/utils/fns";
import type { VariantLUT, VariantValue } from "~/utils/types";


const ButtonVariantList = ["default", "cta", "passive"] as const
export type ButtonVariantValue = VariantValue<typeof ButtonVariantList>

const ButtonVariantLUT: VariantLUT<ButtonVariantValue> = {
  default: cn(
    "bg-back-alt/25 text-front",
    "border-[0.5px] border-front/10",
    "hover:bg-back-alt active:bg-back-alt/25",
  ),
  cta: cn(
    "bg-front/90 text-back border-[0.5px] border-front/50",
    "hover:bg-transparent hover:text-front active:bg-front/5",
  ),
  passive: cn(
    "bg-back-alt/0 text-front/90",
    "border-[0.5px] border-front/0",
    "hover:bg-back-alt/50 hover:border-front/5",
    "active:translate-y-[1px] active:bg-back-alt/50",
  )
}

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariantValue
  icon?: ReactNode
}



const Button = (props: Props) => {
  const {
    variant = "default",
    icon,
    className,
    children,
    ...restProps
  } = props;

  const vstyles = ButtonVariantLUT[variant]

  return (
    <button
      className={cn(
        "transition-all duration-100",
        "rounded-md outline-access outline-1 outline-offset-2",
        "focus-visible:outline",
        vstyles,
        className
      )}
      {...restProps}>
      {
        children && <div className="p-2 leading-none">{children}</div>
      }
      {
        icon && <div className="p-2">{icon}</div>
      }
    </button>
  )
}

export default Button
export type ButtonProps = Props
=======
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
>>>>>>> origin/main
