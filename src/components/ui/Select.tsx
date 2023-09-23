import type { ReactElement } from "react"
import { cn } from "~/utils/fns"
import RadixIcons from "../icons/RadixIcons"
// import { useState } from "react"
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
    <div className={cn(
      "group relative",
      "p-[2px] flex gap-1 items-center",
      "text-front/90 bg-back-alt/75 border-[0.5px] border-front/10 rounded-md outline-access outline-1",
    )}>
      <select
        name={name}
        id={`${name}-select`}
        onInput={(e) => {
          const newValue = e.currentTarget.value
          if (onValueChange) onValueChange(newValue)
          // setValue(newValue)
        }}
        className={cn(
          "peer transition-all duration-150",
          "appearance-none pl-3 pr-8 leading-loose w-full",
          "text-front/90 rounded-md outline-access outline-1",
          "focus-visible:outline",
          "hover:text-front/90",
          "bg-back border-front/5 border-[0.5px] shadow-md",
        )}
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