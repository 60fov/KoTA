import { LayoutGroup, motion, useInView, useSpring, type HTMLMotionProps, type AnimationDefinition } from "framer-motion"
import { type ReactElement, type ReactNode, useCallback, useRef, useEffect } from "react"
import { cn } from "~/utils/fns"

import styles from "./Slider.module.scss"

interface SliderProps {
  index: number
  open?: boolean
  defaultOpen?: boolean,
  children?: ReactElement<typeof Item>[]
  onAnimationStart?: (anim: AnimationDefinition) => void
  onAnimationComplete?: (anim: AnimationDefinition) => void
}

// TODO: sequential animations for expanding / contract (h -> w)

function Base(props: SliderProps) {
  const {
    index,
    open = true,
    defaultOpen = false,
    onAnimationStart,
    onAnimationComplete,
    children
  } = props;

  const currentItemRef = useCallback((node: HTMLDivElement) => {
    if (!node) return
    const rect = node.getBoundingClientRect()
    widthMotionValue.set(rect.width)
    heightMotionValue.set(rect.height)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, children])

  const widthMotionValue = useSpring(0, {
    stiffness: 160,
    damping: 9,
    mass: 0.4,
  })

  const heightMotionValue = useSpring(0, {
    stiffness: 150,
    damping: 10,
    mass: 0.4,
  })

  const sliderFramerVariants = {
    open: {
      width: "100%",
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
        mass: 0.5
      }
    },
    close: {
      width: "0%", transition: {
        duration: 0.25
      }
    }
  }

  const prevItems = children && children.slice(0, index)
  const currentItem = children && children.at(index)
  const nextItems = children && children.slice(index + 1)

  return (
    <div className="overflow-x-clip w-full">
      <motion.div
        layoutId={"slider-base"}
        layout="position"
        className={styles.base}
        initial={defaultOpen ? "open" : "close"}
        animate={open ? "open" : "close"}
        onAnimationComplete={onAnimationStart}
        onAnimationStart={onAnimationComplete}
        variants={sliderFramerVariants}
      >
        <motion.div
          layoutId={"gradient"}
          data-gradient />

        <motion.div
          layoutId={"cursor"}
          data-cursor
          style={{
            width: widthMotionValue,
            height: heightMotionValue
          }}>
        </motion.div>

        {/* items */}
        <div
          data-item-container
          ref={currentItemRef}
        >
          <LayoutGroup>
            <div data-past>{prevItems}</div>
            <div data-present>{currentItem}</div>
            <div data-future>{nextItems}</div>
          </LayoutGroup>
        </div>
      </motion.div>
    </div>
  )
}


type ItemProps = HTMLMotionProps<"div"> & {
  id: string
  onViewEnter?: (el: HTMLDivElement | null) => void
  onViewLeave?: (el: HTMLDivElement | null) => void
  children?: ReactNode
}

function Item(props: ItemProps) {
  const {
    id,
    onViewLeave,
    onViewEnter,
    className = "",
    children,
    ...restProps
  } = props;

  const ref = useRef<HTMLDivElement>(null)
  const wasInViewRef = useRef<boolean>(false)

  const isInView = useInView(ref)

  useEffect(() => {
    const wasInView = wasInViewRef.current
    if (onViewEnter && isInView && !wasInView) onViewEnter(ref.current)
    if (onViewLeave && !isInView && wasInView) onViewLeave(ref.current)
    wasInViewRef.current = isInView
  }, [isInView, onViewLeave, onViewEnter])

  return (
    <motion.div
      className={`${styles.item || ""} ${className}`}
      ref={ref}
      layoutId={id}
      layout="position"
      {...restProps}
    >
      {children}
    </motion.div>
  )
}

const Slider = { Base, Item }
export default Slider