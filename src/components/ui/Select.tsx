import type { ReactElement } from "react"
import { cn } from "~/utils/fns"
import RadixIcons from "../icons/RadixIcons"

import styles from "./Select.module.scss"

// TODO remake select component

interface Props {
  name: string
  label?: string
  defaultValue?: string
  value?: string
  onValueChange?: (newValue: string) => void
  children: ReactElement<OptionProps>[] | ReactElement<OptionProps>
}


const Base = (props: Props) => {
  const {
    name,
    label,
    defaultValue,
    value: valueProp,
    onValueChange,
    children
  } = props

  // TODO: use for refs
  // const [value, setValue] = useState<string | undefined>(valueProp ?? defaultValue)

  return (
    <div className={styles.base}>
      <select
        data-select
        name={name}
        id={`${name}-select`}
        onInput={(e) => {
          const newValue = e.currentTarget.value
          if (onValueChange) onValueChange(newValue)
          // setValue(newValue)
        }}
      >
        {children}
      </select>
      <span className="absolute right-3 pointer-events-none peer-hover:text-front/90">
        <RadixIcons.ChevronDown />
      </span>
    </div>
  )
}

interface OptionProps {
  value: string
  children?: string
}

const Option = (props: OptionProps) => {
  const {
    value,
    children
  } = props;

  return (
    <option value={value}>
      {children || value}
    </option>
  )
}

const Select = { Base, Option }

export default Select