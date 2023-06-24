import { type ReactNode } from "react";
import { cn } from "~/utils/fns";
import type { NonDuplicateProps, VariantValue } from "~/utils/types";

import styles from "./Button.module.scss"
import ui from "./UI.module.scss"

const ButtonVariantList = ["default", "cta", "passive"] as const
export type ButtonVariantValue = VariantValue<typeof ButtonVariantList>

interface OwnProps {
  variant?: ButtonVariantValue
  prefix?: ReactNode
  suffix?: ReactNode
}

type Props = NonDuplicateProps<OwnProps, React.ButtonHTMLAttributes<HTMLButtonElement>>

const Button = (props: Props) => {
  const {
    variant = "default",
    prefix,
    suffix,
    disabled,
    className,
    children,
    ...restProps
  } = props;

  return (
    <button
      className={cn(ui.outline, styles.base, className)}
      data-variant={variant}
      disabled={disabled}
      {...restProps}>
      <div data-label>
        {prefix && <span data-prefix>{prefix}</span>}
        {children && <span data-children>{children}</span>}
        {suffix && <span data-suffix>{suffix}</span>}
      </div>
    </button>
  )
}

export default Button
export type ButtonProps = Props