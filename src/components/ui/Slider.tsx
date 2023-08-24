import { type AnimationDefinition, LayoutGroup, motion, useInView, useSpring, HTMLMotionProps } from "framer-motion"
import { type ReactElement, type ReactNode, useCallback, useRef, useEffect } from "react"
import { cn } from "~/utils/fns"
import { NonDuplicateProps } from "~/utils/types"

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
    <motion.div
      className={cn(
        "relative isolate",
        "overflow-x-clip w-full flex items-center justify-center py-1",
        "border-x-[1px] border-front-alt/50 ",
      )}
      initial={defaultOpen ? "open" : "close"}
      animate={open ? "open" : "close"}
      onAnimationComplete={onAnimationStart}
      onAnimationStart={onAnimationComplete}
      variants={sliderFramerVariants}
    >
      {/* gradient */}
      <div className={cn(
        "pointer-events-none",
        "absolute left-0 right-0 top-0 bottom-0 z-50",
        "bg-gradient-to-r from-back/90 via-transparent to-back/90"
      )} />

      {/* cursor */}
      <motion.div
        className="absolute w-16 p-1 box-content border-[0.5px] border-front/25 rounded bg-front-alt/5"
        style={{
          width: widthMotionValue,
          height: heightMotionValue
        }}>
      </motion.div>

      {/* items */}
      <div
        ref={currentItemRef}
        className={cn(
          "relative flex gap-3",
        )}
      >
        <LayoutGroup>
          <div className="absolute flex gap-3 right-full mr-3">
            {prevItems}
          </div>
          <div className="relative">
            {currentItem}
          </div>
          <div className="absolute flex gap-3 left-full ml-3">
            {nextItems}
          </div>
        </LayoutGroup>
      </div>
    </motion.div>
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
      className={`font-semibold text-4xl text-front whitespace-nowrap ${className}`}
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