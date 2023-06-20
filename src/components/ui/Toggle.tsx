import { useState } from "react";

import styles from "./UI.module.scss";
import { type Controllable } from "./types";

interface Props extends Controllable<boolean> {
  className?: string
  children?: React.ReactNode
}

const Toggle = ({
  defaultValue,
  value: valueProp,
  onValueChange,
  children
}: Props) => {
  const [value, setValue] = useState(valueProp ?? defaultValue)

  const handleClick: React.MouseEventHandler = () => {
    const newValue = !value
    setValue(newValue)
    if (onValueChange) onValueChange(newValue)
  }

  return (
    <button
      type="button"
      className={styles.toggle}
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