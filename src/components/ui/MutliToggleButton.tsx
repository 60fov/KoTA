import { motion } from "framer-motion"
import { createContext, CSSProperties, FormEventHandler, KeyboardEventHandler, MouseEventHandler, ReactElement, ReactNode } from "react"
import { createCtx } from "../../util/context-helper"
import { cn } from "../../util/css"

interface MultiToggleContextInterface {
    name: string
    value: unknown
}

const [useMultiToggleContext, MultiToggleProvider] = createCtx<MultiToggleContextInterface>()

interface Props<T extends string> {
    name: string
    prompt: string
    value: T
    setValue: (value: T) => void
    children: ReactElement<ItemProps<T>>[] | ReactElement<ItemProps<T>>
}

const Base = <T extends string>({ name, prompt, value, setValue, children }: Props<T>) => {
    const handleChange: FormEventHandler<HTMLFieldSetElement> = (e) => {
        const input = e.target as HTMLInputElement
        setValue(input.value as T)
    }

    return (
        <div className="flex p-[2px] bg-back-alt/60 border-[0.5px] border-front/10 rounded-md transition-all duration-75">
            <fieldset onChange={handleChange} className="flex">
                <legend className="absolute [clip:rect(0,0,0,0)]">{prompt}</legend>
                <MultiToggleProvider value={{ name, value }}>
                    {children}
                </MultiToggleProvider>
            </fieldset>
        </div>
    )
}

interface ItemProps<T extends string> {
    value: T
    children?: ReactNode
    style?: CSSProperties

}


export const Item = <T extends string>({ value, children = value, style }: ItemProps<T>) => {
    const { name: toggleName, value: toggleValue } = useMultiToggleContext()

    return (
        <div className="relative flex">
            <input
                className="peer appearance-none absolute"
                type="radio"
                name={toggleName}
                id={value}
                value={value}
                checked={toggleValue === value}
                readOnly={true} />
            <label
                className={cn(
                    "relative flex px-3 items-center justify-center cursor-pointer rounded-md",
                    "text-sm text-front/50 border-front/5 transition-[color]",
                    "hover:text-front/80",
                    // "peer-checked:text-front peer-checked:bg-back peer-checked:border-[0.5px] peer-checked:shadow-md",
                    "peer-focus-visible:outline outline-access outline-1 outline-offset-2"
                )}
                htmlFor={value}
                style={style}>
                {toggleValue === value &&
                    <motion.div 
                    layoutId={"f"}
                    className={cn(
                        "absolute w-full h-full",
                        "text-front rounded bg-back border-front/5 border-[0.5px] shadow-md",
                    )}
                    />
                }
                <div className="relative z-10">
                {children}
                </div>
            </label>
        </div>
    )
}

export default { Base, Item }