import type { ReactNode } from "react";
import { } from "react";
import { cn } from "~/utils/fns";

interface Props {
  title?: string
  desc?: string
  className?: string
  children?: ReactNode
}

export default function Container(props: Props) {
  const {
    title,
    desc,
    className,
    children
  } = props

  return (
    <div
      className={cn(
        "relative w-full h-full",
        "size-base flex gap-4 items-center justify-center p-var",
        "border border-front/10 bg-back rounded-v",
        className
      )}
    // style={{ "--padding": "12px" } as CSSVariableProperties}
    >
      {children}
      <div className="absolute bottom-v left-v flex flex-col gap-1">
        <p className="text-base text-neutral-400">{title}</p>
        <p className="text-sm text-neutral-500">{desc}</p>
      </div>
    </div>
  )
}