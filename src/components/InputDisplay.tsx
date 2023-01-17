import { AnimatePresence, motion, useSpring } from "framer-motion"
import { useEffect } from "react"
import { cn } from "../util/css"

interface InputDisplayProps {
    input: string
    goal?: string
    focused?: boolean
    composing?: boolean
}

const InputDisplay = (props: InputDisplayProps) => {
    const { input, goal = '', focused = true, composing, ...restProps } = props

    const output = input.replaceAll(' ', '•')

    const ch = useSpring(0, {
        stiffness: 150,
        damping: 10,
        mass: 0.5
    })

    // TODO: audit, remove effect
    useEffect(() => {
        if (focused) ch.set(1)
        else ch.set(0)
    }, [focused])

    // TODO: current char is incorrect once not composing
    const errorTest = (i: number) => i >= goal.length || (i < goal.length && i < output.length - 1 && output[i] !== goal[i])

    return (
        <div className="relative flex">
            <div className={cn(
                "h-12 whitespace-nowrap",
                "text-front text-5xl font-semibold")}>
                {/* TODO: make space symbol a settings  */}
                {output.split('').map((block, i) => (
                    <span key={block + `${i}`}
                        className={cn(
                            "relative transition-colors",
                            errorTest(i) && "text-error",
                            input[i] === ' ' && "opacity-50"
                        )}>
                        {block}
                        {composing && i === output.length - 1 ?
                            <motion.span
                                layoutId="composing-indicator"
                                className="absolute h-[2px] left-0 right-0 top-full rounded-sm bg-front" />
                            :
                            <></>
                        }
                    </span>
                ))}
            </div>
            <motion.div layout="position"
                style={{ scaleY: ch }}
                animate={{ opacity: [0.25, 1] }}
                transition={{
                    opacity: {
                        type: 'tween',
                        ease: 'easeOut',
                        duration: 0.9,
                        repeat: Infinity,
                        repeatType: 'mirror',
                    },
                    layout: {}
                }}
                className="absolute -right-2 h-12 translate-x-full w-1 bg-front rounded-[1px]" />
        </div >
    )

}

export default InputDisplay 