import { useState } from "react"
import styles from "./Input.module.scss"
import { Controllable } from "./types"

interface Props extends Controllable<string> {
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  inputProps?: React.HTMLProps<HTMLInputElement> & {
    defaultValue?: string
  }
}

const Input = (props: Props) => {
  const {
    inputProps,
  } = props

  const [valueState, setValueState] = useState(props.value || inputProps?.defaultValue)

  const value = props.value || valueState

  const handleInput: React.FormEventHandler<HTMLInputElement> = (e) => {
    const newValue = e.currentTarget.value
    setValueState(newValue)
    if (props.onValueChange) props.onValueChange(newValue)
  }

  return (
    <div className={styles.base}>
      {props.prefix && <div data-prefix>{props.prefix}</div>}
      <input data-input {...inputProps} value={value} onInput={handleInput} />
      {props.suffix && <div data-suffix>{props.suffix}</div>}
    </div>
  )
}

export default Input