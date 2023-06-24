import styles from "./Toggle.module.scss";
import ui from "./UI.module.scss";

import { useState } from "react";

import { type Propagatable, type Controllable } from "./types";
import { cn } from "~/utils/fns";

interface Props extends Controllable<boolean>, Propagatable {
  className?: string
  children?: React.ReactNode
}

const Toggle = ({
  defaultValue,
  value: valueProp,
  onValueChange,
  propagate = false,
  children
}: Props) => {
  const [value, setValue] = useState(valueProp ?? defaultValue)

  const handleClick: React.MouseEventHandler = (e) => {
    if (!propagate) e.stopPropagation()
    const newValue = !value
    setValue(newValue)
    if (onValueChange) onValueChange(newValue)
  }

  return (
    <button
      type="button"
      className={cn(ui.outline, styles.base)}
      data-state={value ? 'on' : 'off'}
      onClick={handleClick}
    >
      <div data-toggle-content>
        {children}
      </div>
    </button>
  )
}

export default Toggle