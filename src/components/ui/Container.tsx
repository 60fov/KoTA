import type { ReactNode } from "react";
import { cn } from "~/utils/fns";

import styles from "./Container.module.scss"

interface Props {
  title?: string
  desc?: string
  className?: string
  children?: ReactNode
}

export default function Container(props: Props) {
  const {
    className,
    children
  } = props

  return (
    <div className={cn(styles.base, className)}>
      {children}
    </div>
  )
}