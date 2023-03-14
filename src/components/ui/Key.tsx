import { cn } from "~/utils/fns"

type Props = {
  label?: string
  code: string
  down?: boolean
  expand?: boolean
}

// TODO: find alternative to useKeyState repeat flag no work
// TODO: switch to position centric pacement of key symbols
const Key = (props: Props) => {
  const {
    label,
    code,
    down: downProp,
    expand = false
  } = props

  // const down = downProp ?? useKey(code)
  const down = downProp

  return (
    <div
      className={cn(
        "relative",
        "w-10 h-10 flex items-center justify-center",
        "rounded-md text-front/90 bg-front-alt/10 border-[rgb(0,0,0)]/20",
        "transition-all duration-75 select-none",
        expand ? 'grow' : '',
        down ? 'border-b-0 translate-y-[2px] bg-front-alt/90 text-back/90' : 'border-b-2 translate-y-0'
      )}>
      <span>{label}</span>
      <span className="absolute bottom-1 right-1 text-xs text-neutral-500 italic">{code}</span>
    </div>
  )
}

export default Key
