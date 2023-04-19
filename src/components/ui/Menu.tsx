import React, { type ReactNode, type ReactElement, useState, useRef, useEffect } from "react";
import { cn, createCtx } from "~/utils/fns";
import Check from "../icons/Check";
import Portal from "./Portal";

import Button, { type ButtonProps } from "./Button";
import HBMenu from "../icons/HBMenu";
import { useOnClickOutside } from "~/utils/hooks";

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
      <div ref={baseRef} className="relative flex">
        {children}
      </div>
    </MenuContextProvider>
  )
}



function MenuButton(props: ButtonProps) {
  const {
    icon = <HBMenu />,
    ...restProps
  } = props

  const { open, setOpen } = useMenuContext()

  return (
    <Button
      {...restProps}
      icon={icon}
      onClick={() => {
        setOpen(!open)
      }}
    />
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

  useOnClickOutside([baseRef, menuRef], () => setOpen(false))

  return (
    <Portal>{
      open ?
        <div className="absolute inset-0">
          <div
            ref={menuRef}
            className={cn(
              "absolute",
              "flex flex-col gap-2 top-full p-1 w-64",
              "bg-back border border-front/10 rounded-lg text-front",
            )}
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
    <div className={cn(
      "flex flex-col",
      "text-front-alt leading-none"
    )}>
      {
        title &&
        <p className={cn(
          "ml-9 py-2 text-xs leading-none"
        )}>
          {title}
        </p>
      }
      <div className={cn(
        "flex flex-col gap-1",
      )}>
        {children}
      </div>
    </div>
  )
}



// ITEM

type ItemOwnProps<T extends React.ElementType = React.ElementType> = {
  as?: T
  icon?: ReactNode
  suffix?: ReactNode
  children: string
}

type ItemProps<T extends React.ElementType> =
  ItemOwnProps &
  Omit<React.ComponentProps<T>, keyof ItemOwnProps>

function Item<T extends React.ElementType>(props: ItemProps<T>) {
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
    <TagName {...restProps} className={cn(
      "appearance-none transition-colors duration-75",
      "flex items-center gap-2 p-2",
      "rounded text-sm leading-none text-front whitespace-nowrap",
      "focus-visible:outline outline-1 outline-access",
      disabled ?
        "cursor-not-allowed text-front-alt/25" :
        "hover:bg-back-alt active:bg-back-alt/50",
      className
    )}>
      <div className="flex items-center justify-center h-5 aspect-square">
        {icon}
      </div>
      <div className="grow text-left overflow-ellipsis">
        {children}
      </div>
      <div className="text-front-alt ">
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
    icon = <Check />,
    ...restProps
  } = props

  const [toggle, setToggle] = useState(initialToggle)

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
  return <div className="mr-2 ml-9 h-[0.5px] bg-front-alt/50"></div>
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