import type { CSSProperties, FormEventHandler, ReactElement, ReactNode } from "react"
import { useState } from "react"

import { motion } from "framer-motion"

import { type CSSVariableProperties } from "~/utils/types"
import { cn, createCtx } from "~/utils/fns"

interface MultiToggleContextInterface {
  name: string
  value: unknown
}

const [useMultiToggleContext, MultiToggleProvider] = createCtx<MultiToggleContextInterface>()

interface Props<T extends string> {
  name: string
  prompt: string
  defaultValue?: T
  value?: T
  onValueChange?: (value: T) => void
  children: ReactElement<ItemProps<T>>[] | ReactElement<ItemProps<T>>
}

const Base = <T extends string>(props: Props<T>) => {
  const {
    name,
    prompt,
    defaultValue,
    value: valueProp,
    onValueChange,
    children
  } = props;

  const [value, setValue] = useState<T | undefined>(valueProp ?? defaultValue)

  const handleChange: FormEventHandler<HTMLFieldSetElement> = (e) => {
    const input = e.target as HTMLInputElement
    const newValue = input.value as T
    // TODO: calling both could be two render
    setValue(newValue)
    if (onValueChange) onValueChange(newValue)
  }

  return (
    <div
      style={{ "--spacing": "2px" } as CSSVariableProperties}
      className={cn(
        // 🙏
        // "focus-visiblie-within:outline outline-access outline-1 outline-offset-2",
        "transition-all duration-75",
        "p-v h-8 box-content flex",
        "bg-back-alt/75 border-[0.5px] border-front/10 rounded-md"
      )}>
      <fieldset onChange={handleChange} className="flex">
        <legend className="absolute [clip:rect(0,0,0,0)]">{prompt}</legend>
        <MultiToggleProvider value={{ name, value }}>
          {children}
        </MultiToggleProvider>
      </fieldset>
    </div>
  )
}

interface ItemProps<T extends string> {
  value: T
  children?: ReactNode
  style?: CSSProperties

}


export const Item = <T extends string>({ value, children = value, style }: ItemProps<T>) => {
  const { name: toggleName, value: toggleValue } = useMultiToggleContext()

  return (
    <div className="relative flex">
      <input
        className="peer appearance-none absolute"
        type="radio"
        name={toggleName}
        id={value}
        value={value}
        checked={toggleValue === value}
        readOnly={true}
      />
      <label
        className={cn(
          "relative",
          "flex w-8 h-full items-center justify-center cursor-pointer rounded-md",
          "text-sm text-front/50 border-front/5 transition-[color] outline-access outline-1 outline-offset-2",
          "hover:text-front/80",
          "peer-checked:text-front",
          "peer-focus-visible:outline"
        )}
        htmlFor={value}
        style={style}
      >
        <div className="relative w-8 h-8 flex items-center justify-center">
          <span className="z-10">
            {children}
          </span>
          {toggleValue === value &&
            <motion.div
              layoutId={`${toggleName}-value-bg`}
              transition={{
                stiffness: 120
              }}
              className={cn(
                "absolute w-full h-full",
                "text-front rounded bg-back border-front/5 border-[0.5px] shadow-md",
              )}
            />
          }
        </div>
      </label>
    </div>
  )
}

const MultiToggle = { Base, Item }

export default MultiToggle