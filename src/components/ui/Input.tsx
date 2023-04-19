import React, { useState, type ReactNode, InputHTMLAttributes } from "react"
import { cn } from "~/utils/fns"

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, "prefix"> {
  outlineOnFocus?: boolean
  disabled?: boolean
  prefix?: ReactNode
  suffix?: ReactNode
  label?: string
  status?: string
  state?: "error" | "success"
}

const Input = (props: Props) => {
  const {
    outlineOnFocus,
    disabled,
    prefix,
    suffix,
    label,
    status,
    state,
    className,
    ...restProps
  } = props

  return (
    <div className={"flex flex-col text-front gap-2"}>
      {label && <label className="text-sm text-front-alt">{label}</label>}
      <div className={cn(
        "overflow-clip w-full flex",
        "bg-back rounded-md",
        outlineOnFocus ? "outline-access outline-1 outline-offset-2 focus-within:outline" : "outline-none",
        "border border-front/10 focus-within:border-front/50",
        state === "error" && "border-error/50 focus-within:border-error",
        "transition-colors duration-100"
      )}>
        {prefix && <div className="flex items-center justify-center p-2">{prefix}</div>}
        <input
          disabled={disabled}
          className={cn(
            "appearance-none leading-none outline-none",
            "w-full p-2",
            "bg-back",
            "placeholder:text-front/40",
            disabled && "text-front/50",
            className
          )}
          {...restProps}
        />
        {suffix && <div className="flex items-center justify-center p-2">{suffix}</div>}
      </div>
      <span className={cn(
        "text-front-alt italic text-xs",
        state === "error" && "text-error",
        state === "success" && "text-green-400",
      )}>{status}</span>
    </div>
  )
}

export default Input