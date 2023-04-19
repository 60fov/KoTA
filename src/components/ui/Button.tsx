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

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariantValue
  icon?: ReactNode
}

const Button = (props: Props) => {
  const {
    variant = "default",
    icon,
    disabled,
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
        !disabled ? vstyles : "text-front-alt border border-front-alt/20 bg-back-alt",
        className
      )}
      disabled={disabled}
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