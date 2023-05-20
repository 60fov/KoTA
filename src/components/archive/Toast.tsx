import { cn } from "~/utils/fns";

interface ToastInstance {
  title: string
  desc?: string
}

const toastList: ToastInstance[] = []

function toast(title: string, desc?: string) {
  toastList.push({ title, desc })
}

interface Props {
  title: string
  desc?: string
}

function Default(props: Props) {
  const {
    title,
    desc,
  } = props

  return (
    <div className={cn(
      "rounded-lg p-2",
      "w-64 flex flex-col gap-2",
      "bg-back-alt/25 text-front",
      "border-[0.5px] border-front/10",
      "shadow-md"
    )}>
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-sm font-normal">{desc}</p>
    </div>
  )
}

function Manager() {

  const toastRenderer = () => {
    return (
      toastList.map((toast, i) => (
        <Default {...toast} key={i} />
      ))
    )
  }

  return (
    <div className={cn(
      "fixed w-screen h-screen"
    )}>
      {toastRenderer()}
    </div>
  )
}

const Toast = {
  Default,
  Manager
}

export { Toast }
export default toast

