import { motion, useInView, useSpring } from "framer-motion"
import { forwardRef, ReactNode, RefObject, useEffect, useImperativeHandle, useRef, useState } from "react"
import { createCtx } from "../util/context-helper"
import { cn } from "../util/css"
import { clamp, wrap0 } from "../util/maths"


interface HSliderContextInterface {
    root: RefObject<HTMLElement>
}

const [useHSliderContext, HSliderContextProvider] = createCtx<HSliderContextInterface>()

interface Ref {
    prev: () => void
    next: () => void
    setIndex: (i: number) => void
    getIndex: () => number
    getIndexRaw: () => number
    root: RefObject<HTMLDivElement>
}

interface Props {
    index?: number
    wrap?: boolean
    className?: string
    children: ReactNode
    onChange?: (index: number) => void
}

const Container = forwardRef<Ref, Props>((props, ref) => {
    const { children, index: indexProp, wrap = false, onChange, className } = props

    const rootRef = useRef<HTMLDivElement>(null)
    const trackRef = useRef<HTMLDivElement>(null)
    const prevOffsetRef = useRef(0)

    const [indexRaw, setIndexRaw] = useState(0)
    const elementCount = trackRef.current ? trackRef.current.children.length : 0
    const index = indexProp ?? wrap ? wrap0(indexRaw, elementCount) : clamp(indexRaw, 0, elementCount - 1)
    const element = trackRef.current?.children[index]

    useEffect(() => {
        if (onChange) onChange(index)
    }, [element])

    const xm1 = useSpring(0, { stiffness: 130, mass: 0.1 })
    const xm2 = useSpring(0, { stiffness: 130, mass: 0.1 })
    const width = useSpring(0)
    const offset = useSpring(0, {
        damping: 15,
        mass: 0.5,
        stiffness: 180
    })

    // useEffect(() => {
    //     if (trackRef.current === null) return
    //     const element = trackRef.current.children[index] as HTMLDivElement
    //     if (!element) return

    //     const offsetNew = -element.offsetLeft
    //     offset.set(offsetNew)
    //     width.set(element.clientWidth)
    //     prevOffsetRef.current = offsetNew
    // }, [index])

        useEffect(() => {
        if (trackRef.current === null) return
        const element = trackRef.current.children[index] as HTMLDivElement
        if (!element) return

        const offsetNew = -element.offsetLeft

        offset.set(offsetNew)
        width.set(element.clientWidth)
        prevOffsetRef.current = offsetNew
    }, [index])

    useEffect(() => {
        if (trackRef.current === null) return
        const element = trackRef.current.children[index] as HTMLDivElement
        if (!element) return

        const offsetNew = -element.offsetLeft
        const offsetOld = prevOffsetRef.current

        if (offsetOld < offsetNew) {
            const offsetDiff = offsetOld - offsetNew
            offset.jump(offset.get() - offsetDiff)
        }

        offset.set(offsetNew)
        width.set(element.clientWidth)
        prevOffsetRef.current = offsetNew
    }, [children])


    // TODO: wrap
    useImperativeHandle(ref, () => ({
        prev() {
            setIndexRaw(indexRaw - 1)
        },
        next() {
            setIndexRaw(indexRaw + 1)
        },
        setIndex(i: number) {
            setIndexRaw(i)
        },
        getIndex() {
            return index
        },
        getIndexRaw() {
            return indexRaw
        },
        root: rootRef
    }))

    return (
        <div ref={rootRef} className={cn(
            "relative",
            className
        )}>
            <motion.div
                className={cn(
                    "relative p-1 box-content",
                    "border-[0.5px] border-front/25 rounded bg-front/5"
                )}
                style={{ width }}
            >
                {/* <motion.div className={"absolute top-0 left-0 w-1 h-full bg-green-300"} style={{ x: xm1 }} />
                <motion.div className={"absolute top-0 left-0 w-1 h-full bg-green-500"} style={{ x: xm2 }} /> */}
                <motion.div
                    ref={trackRef}
                    style={{ x: offset }}
                    className={cn(
                        'relative flex gap-3',
                        // dir === 'column' ? 'flex-col' : 'flex-row'
                    )}>
                    <HSliderContextProvider value={{ root: rootRef }}>
                        {children}
                    </HSliderContextProvider>
                </motion.div>
            </motion.div>
        </div>
    )
})

interface ElementProps {
    onViewLeave: () => void
    className?: string
    children: ReactNode
}

const Element = (props: ElementProps) => {
    const { children, onViewLeave, ...restProps } = props

    const { root } = useHSliderContext()

    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { root, margin: "0px 0px 0px 0px" })

    useEffect(() => {
        if (!ref.current || !root.current) return
        const rect = ref.current.getBoundingClientRect()
        const rootRect = root.current.getBoundingClientRect()
        if (rect.right < rootRect.left) {
            if (!isInView) console.log('not in view', rect.right, rootRect.left)
            onViewLeave()
        }
    }, [isInView])

    return (
        <div ref={ref} {...restProps}>
            {children}
        </div>
    )

}


export type HSliderRef = Ref
export default { Container, Element }