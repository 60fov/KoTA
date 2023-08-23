import type { FormEventHandler, ReactElement, ReactNode } from "react"
import { useEffect, useState } from "react"

import { motion } from "framer-motion"

import { cn, createCtx } from "~/utils/fns"
import { type Controllable } from "./types"

import ui from "./UI.module.scss"
import styles from "./MultiToggle.module.scss"

interface MultiToggleContextInterface {
  name: string
  value: unknown
}

const [useMultiToggleContext, MultiToggleProvider] = createCtx<MultiToggleContextInterface>()

interface Props<T extends string> extends Controllable<T> {
  name: string
  prompt: string
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

  const [value, setValue] = useState(valueProp ?? defaultValue)

  // NOTE: feel like theres a better way
  useEffect(() => {
    if (valueProp) setValue(valueProp)
  }, [valueProp])

  const handleChange: FormEventHandler<HTMLFieldSetElement> = (e) => {
    const input = e.target as HTMLInputElement
    const newValue = input.value as T
    setValue(newValue)
    if (onValueChange) onValueChange(newValue)
  }

  return (
    <div
      tabIndex={1}
      className={cn(ui.outline, styles.base)}>
      <fieldset onChange={handleChange}>
        <legend data-legend>{prompt}</legend>
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
}


export const Item = <T extends string>({ value, children = value }: ItemProps<T>) => {
  const { name: toggleName, value: toggleValue } = useMultiToggleContext()

  return (
    <div data-mutlitoggle-item>
      <input
        type="radio"
        // @typescript-eslint/no-unsafe-assignment
        name={toggleName}
        id={value}
        value={value}
        checked={toggleValue === value}
        readOnly={true}
      />
      <label htmlFor={value}>
        <div data-children>
          {children}
        </div>
        {toggleValue === value &&
          <motion.div
            data-background
            layoutId={`${toggleName}-value-bg`}
            transition={{ stiffness: 120 }}
          />
        }
      </label>
    </div>
  )
}

const MultiToggle = { Base, Item }

export default MultiToggle