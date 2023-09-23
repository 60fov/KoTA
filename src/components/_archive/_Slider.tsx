import { motion, useSpring, useTransform } from "framer-motion"
import { type ReactElement, type ReactNode, useCallback, forwardRef, useState } from "react"
import {  } from "react"
import { cn } from "~/utils/fns"

interface SliderProps {
  index: number
  children: ReactElement<typeof Item>[]
}

export interface SliderRef {
  next: () => void
  prev: () => void
}

const Base = forwardRef<SliderRef, SliderProps>(function Base(props: SliderProps, ref) {
  const {
    index,
    children
  } = props;

  // const currentItemRef = useRef<HTMLDivElement>(null)

  const [currentItemRect, setCurrentItemRect] = useState<DOMRect>({ x: 0, y: 0, width: 0, height: 0 } as DOMRect)

  const currentItemRef = useCallback((node: HTMLDivElement) => {
    if (!node) return
    const rect = node.getBoundingClientRect()
    setCurrentItemRect(rect)
    // console.log("measuring item", node.textContent, rect, node.offsetLeft)
    widthMotionValue.set(rect.width)
    heightMotionValue.set(rect.height)
    console.log("index", index)
    if (offsetMotionValue.get() > node.offsetLeft) {
      console.log("omv", offsetMotionValue.get())
      // console.log("pre", currentItemRef)
      console.log("left", node.offsetLeft)
      // console.log( - )
      // offsetMotionValue.jump(node.offsetLeft)
    }
    // offsetMotionValue.set(node.offsetLeft)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  const widthMotionValue = useSpring(0, {
    stiffness: 150,
    damping: 9,
    mass: 0.4,
  })

  const heightMotionValue = useSpring(0, {
    stiffness: 150,
    damping: 10,
    mass: 0.4,
  })

  const offsetMotionValue = useSpring(0, {
    stiffness: 50,
    damping: 9,
    mass: 0.4,
  })

  const leftMotionValue = useTransform(offsetMotionValue, value => -value)

  // useLayoutEffect(() => {
  //   const w = currentItemRect.width;
  //   const h = currentItemRect.height;

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [children, index])

  return (
    <div className={cn(
      "relative overflow-x-clip w-full flex items-center justify-center",
      "border-x-[1px] border-front-alt/50"
    )}>
      {/* gradient */}
      <div className={cn(
        "absolute left-0 right-0 top-0 bottom-0 z-50",
        "bg-gradient-to-r from-back/90 via-transparent to-back/90"
      )} />

      {/* cursor */}
      <motion.div className="absolute w-16 p-1 box-content border-[0.5px] border-front/25 rounded bg-front-alt/5"
        style={{
          width: widthMotionValue,
          height: heightMotionValue
        }}>
      </motion.div>

      {/* items */}
      <motion.div className={cn(
        "relative flex gap-3",
      )}
        style={{
          width: widthMotionValue,
          left: leftMotionValue
        }}>
        {
          children.map((child, i) => {
            if (i === index) {
              return <div key={child.key} ref={currentItemRef}>{child}</div>
            } else {
              return child
            }
          })
        }
      </motion.div>
    </div>
  )
})


interface ItemProps {
  key: string
  children?: ReactNode
}

function Item(props: ItemProps) {
  const {
    children
  } = props;

  return (
    <div className="font-semibold text-4xl text-front whitespace-nowrap">
      {children}
    </div>
  )
}

const Slider = { Base, Item }
export default Slider