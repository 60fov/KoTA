import type { ReactNode } from "react";
import { } from "react";
import { cn } from "~/utils/fns";
import { type CSSVariableProperties } from "~/utils/types";

interface Props {
  title?: string
  desc?: string
  className?: string
  children?: ReactNode
}

export default function Container(props: Props) {
  const {
    className,
    children
  } = props

  return (
    <div
      className={cn(
        "relative",
        "border border-front/10 bg-back rounded-v",
        className
      )}
      style={{ "--radius": "12px" } as CSSVariableProperties}
    >
      {children}
    </div>
  )
}