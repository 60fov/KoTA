import React, { type ReactNode, type ReactElement, useState, useRef, useEffect } from "react";
import { cn, createCtx } from "~/utils/fns";
import Portal from "./Portal";

import Button, { type ButtonProps } from "./Button";
import { useOnClickOutsideMany } from "~/utils/hooks";
import RadixIcons from "../icons/RadixIcons";

import styles from "./Menu.module.scss";
import Stack from "./Stack";

/*
TODO: 
animate menu open / close
establish directional hierarchy for portal placement
*/

interface MenuContextInterface {
  open: boolean
  setOpen: (open: boolean) => void
  baseRef: React.RefObject<HTMLDivElement>
}

const [useMenuContext, MenuContextProvider] = createCtx<MenuContextInterface>()

interface Props {
  open?: boolean
  children: ReactElement[] | ReactElement
}

function Base(props: Props) {
  const {
    open: openProp,
    children
  } = props

  const baseRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  return (
    <MenuContextProvider value={{ open: openProp ?? open, setOpen, baseRef }}>
      <div ref={baseRef} className={"relative flex"}>
        {children}
      </div>
    </MenuContextProvider>
  )
}



function MenuButton(props: ButtonProps) {
  const {
    children = <RadixIcons.HamburgerMenu />,
    ...restProps
  } = props

  const { open, setOpen } = useMenuContext()

  return (
    <Button
      {...restProps}
      onClick={() => {
        setOpen(!open)
      }}>
      {children}
    </Button>

  )
}



// PORTAL

interface PortalProps {
  offset?: number
  children: ReactNode
}

function MenuPortal(props: PortalProps) {
  const {
    offset = 8,
    children
  } = props

  const { open, setOpen, baseRef } = useMenuContext()

  const menuRef = useRef<HTMLDivElement>(null)

  // position menu
  useEffect(() => {
    const base = baseRef.current
    const menu = menuRef.current
    if (!base || !menu) return
    const baseRect = base.getBoundingClientRect()
    const menuRect = menu.getBoundingClientRect()

    const left =
      baseRect.left + menuRect.width > window.innerWidth ? (
        baseRect.left - menuRect.width
      ) : (
        baseRect.left
      )

    const top =
      baseRect.bottom + menuRect.height > window.innerHeight ? (
        baseRect.top - menuRect.height - offset
      ) : (
        baseRect.bottom + offset
      )

    menu.style.left = `${left}px`
    menu.style.top = `${top}px`
  }, [open, baseRef, offset])

  useOnClickOutsideMany([menuRef, baseRef], () => setOpen(false))

  return (
    <Portal>{
      open ?
        <div className={styles.portal}>
          <div
            ref={menuRef}
            data-menu-window
          >
            {children}
          </div>
        </div>
        :
        null
    }</Portal>
  )
}



// SECTION

interface SectionProps {
  title?: string
  disabled?: boolean
  children: ReactElement[] | ReactElement
}

function Section(props: SectionProps) {
  const {
    title,
    children
  } = props

  return (
    <div data-menu-section>
      {
        title &&
        <p data-menu-section-title>
          {title}
        </p>
      }
      <Stack gap={0}>
        {children}
      </Stack>
    </div>
  )
}



// ITEM
type ItemTag = React.ElementType

type ItemOwnProps<T extends ItemTag = ItemTag> = {
  as?: T
  icon?: ReactNode
  suffix?: ReactNode
  children: string
}

type ItemProps<T extends ItemTag> =
  ItemOwnProps &
  Omit<React.ComponentProps<T>, keyof ItemOwnProps>

function Item<T extends ItemTag>(props: ItemProps<T>) {
  const {
    as: TagName = "div",
    icon,
    suffix,
    disabled,
    className,
    children,
    ...restProps
  } = props

  return (
    <TagName {...restProps}
      data-menu-item
      data-disabled={disabled}
    >
      <div data-menu-item-icon>
        {icon}
      </div>
      <div data-menu-item-content>
        {children}
      </div>
      <div data-menu-item-suffix>
        {suffix}
      </div>
    </TagName>
  )
}



// TOGGLE

type ToggleProps = {
  initialToggle?: boolean
  toggle?: boolean
  onToggleChange?: (on: boolean) => void
} & ItemProps<"button">

Item.Toggle = function ItemToggle(props: ToggleProps) {
  const {
    initialToggle = false,
    toggle: toggleProp,
    onToggleChange,
    icon = <RadixIcons.Check />,
    ...restProps
  } = props

  const [toggle, setToggle] = useState(toggleProp ?? initialToggle)

  const handleChange: React.MouseEventHandler = () => {
    const newToggle = !toggle
    setToggle(newToggle)
    if (onToggleChange) onToggleChange(newToggle)
  }

  const on = toggleProp ?? toggle

  return (
    <Item
      as="button"
      {...restProps}
      onClick={handleChange}
      data-state={on ? "on" : "off"}
      icon={on && icon}
    />
  )
}



// DIVIDER

function Divider() {
  return <div data-menu-divider />
}

const Menu = {
  Base,
  Button: MenuButton,
  Portal: MenuPortal,
  Section,
  Item,
  Divider
}




export default Menu