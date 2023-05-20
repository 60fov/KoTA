import { cn } from "~/utils/fns";

import { toast as sonner } from "sonner";

type ToastId = number | string

interface Props {
  title: string
  desc?: string
  toastId: ToastId
}

function Default(props: Props) {
  const {
    title,
    desc,
  } = props

  return (
    <div className={cn(
      "rounded-lg p-4",
      'w-[356px]',
      "flex flex-col gap-2",
      "bg-back text-front",
      "border-[0.5px] border-front/20",
      "shadow-md"
    )}>
      <p className="text-base font-medium">{title}</p>
      <p className="text-sm font-normal text-front-alt">{desc}</p>
    </div>
  )
}

function pop(title: string, desc?: string) {
  sonner.custom((toastId) => <Default {...{ title, desc, toastId }} />)
}

const toast = {
  pop,
}

export default toast