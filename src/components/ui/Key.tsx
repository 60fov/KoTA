import { useKioKey } from "~/hooks/kio"

import styles from "./Key.module.scss"

type Props = {
  size?: number
  label?: string
  code: string
  down?: boolean
  expand?: boolean
  listen?: boolean
}

// TODO: find alternative to useKeyState repeat flag no work
// TODO: switch to position centric pacement of key symbols
const Key = (props: Props) => {
  const {
    size = 44,
    label,
    code,
    down: downProp,
    expand = false,
  } = props

  const isDown = useKioKey(code)

  const down = downProp ?? isDown

  return (
    <div
      className={styles.base}
      data-down={down}
      data-expand={expand}
      id={`key-${code}`}
      style={{ width: size, height: size }}>
      <span data-label>{label}</span>
      <span data-keycode>{code}</span>
    </div>
  )
}

export default Key
