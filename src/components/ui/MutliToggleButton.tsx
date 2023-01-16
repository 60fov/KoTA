import { createContext, CSSProperties, FormEventHandler, KeyboardEventHandler, MouseEventHandler, ReactElement, ReactNode } from "react"
import { createCtx } from "../../util/context-helper"

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
        <div className="flex p-[2px] bg-back-alt/60 border-[0.5px] border-front/5 rounded-md transition-all duration-75">
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
                className="text-sm flex px-3 items-center justify-center cursor-pointer rounded-md text-front/50 transition-[color] hover:text-front/80 peer-checked:text-front peer-checked:bg-back peer-checked:border-[0.5px] border-front/5 peer-checked:shadow-md peer-focus:outline outline-access outline-1"
                htmlFor={value}
                style={style}>
                {children}
            </label>
        </div>
    )
}

export default { Base, Item }