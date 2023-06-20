import RootLayout from "./RootLayout";

import styles from "./DashboardLayout.module.scss"
import { createCtx } from "~/utils/fns";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function DashboardLayout(page: React.ReactElement) {

  const router = useRouter()

  const navpage = router.pathname.split("/").pop()

  return (
    <RootLayout>
      <div className={styles.dashboard}>
        <div style={{ height: 64 }} />
        <Nav defaultValue={navpage}>
          <Nav.Item value="stats">User Stats</Nav.Item>
          <Nav.Item value="words">Word List</Nav.Item>
          <Nav.Item value="social">Social</Nav.Item>
        </Nav>

        <div style={{ flex: "1", overflow: "hidden" }}>
          {page}
        </div>
      </div>
    </RootLayout >
  )
}





interface NavContextInterface {
  value: string
  changeValue: (v: string) => void
}

const [useNavContext, NavContextProvider] = createCtx<NavContextInterface>()

function Nav(props: {
  defaultValue?: string,
  value?: string,
  onValueChange?: (value: string) => void,
  children: React.ReactNode
}) {
  const {
    value: valueProp,
    defaultValue,
    onValueChange,
    children
  } = props

  const [value, setValue] = useState(valueProp ?? defaultValue ?? "")

  const changeValue = (value: string) => {
    setValue(value)
    if (onValueChange) onValueChange(value)
  }

  return (
    <NavContextProvider value={{ value, changeValue }}>
      <nav className={styles.dashboardNav}>
        {children}
      </nav>
    </NavContextProvider>
  )
}

Nav.Item = function Item(props: {
  value: string,
  children: React.ReactNode,
}) {
  const {
    value,
    children,
  } = props

  const nav = useNavContext()

  const selected = value === nav?.value

  const handleClick: React.MouseEventHandler = () => {
    nav?.changeValue(value)
  }

  return (
    <Link href={`/dashboard/${value}`}>
      <div
        onClick={handleClick}
        data-selected={selected}
        data-item
        data-value={value}>
        {children}
      </div>
    </Link>
  )
}