import { cn } from "~/utils/fns";

import { toast as sonner } from "sonner";

import styles from "./Toast.module.scss";
import RadixIcons from "../icons/RadixIcons";

type ToastId = number | string

interface Props {
  title?: string
  desc?: string
  toastId: ToastId
}

function Default(props: Props) {
  const {
    title,
    desc,
    toastId
  } = props

  const close = () => {
    sonner.dismiss(toastId);
  }

  return (
    <div className={styles.base}>
      {/* <div className="flex">
        {title && <p data-title>{title}</p>}
        <div className="grow"/>
        <div className="" onClick={close}><RadixIcons.ChevronDown /></div>
      </div> */}
      {desc && <p data-desc>{desc}</p>}
    </div>
  )
}

function pop(options: { title?: string, desc?: string }) {
  sonner.custom((toastId) => <Default {...{ ...options, toastId }} />)
}

const toast = {
  pop,
}

export default toast