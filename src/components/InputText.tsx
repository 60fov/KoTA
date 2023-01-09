import { AnimatePresence, motion } from "framer-motion"
import { forwardRef } from "react"

type Props = {
    blocks: string
    composing: string
}

// TODO: space symbol setting
// const spaceSymbol = '·'
const spaceSymbol = '␣'

// TODO: goal word comparison for error text 
const InputText = forwardRef<HTMLInputElement, Props>(({ blocks, composing }: Props, ref) => {
    return (
        <>
            <div className="relative text-5xl text-front font-semibold h-12 self-center flex items-center justify-center rounded-md p-2 box-content outline-access">
                <input
                    type="text"
                    ref={ref}
                    className="peer absolute [clip:rect(0,0,0,0)]"
                />
                <span>{blocks.replaceAll(' ', spaceSymbol)}</span>
                <span className="relative h-12">
                    <span>{composing}</span>
                    <AnimatePresence>
                        {composing ?
                            <motion.span
                                className="absolute bg-front/50 left-0 right-0 top-full h-1 rounded-sm"
                                key={`composition-indicator`}
                                layout
                                transition={{ type: 'spring', stiffness: 150, mass: 0.5 }}
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                exit={{ scaleX: 0 }}
                            />
                            :
                            <></>
                        }
                    </AnimatePresence>
                </span>
                <span className="w-1 h-0 peer-focus:h-12 transition-all ease-out bg-front animate-pulse opacity-10 rounded-[1px]" />
                {/* <span className="peer-focus:hidden">press a key...</span> */}
            </div>
        </>
    )
})

export default InputText