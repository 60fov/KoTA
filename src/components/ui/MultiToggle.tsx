import { FormEventHandler, KeyboardEventHandler, MouseEventHandler } from "react"

type Option = {
    name: string
    value?: string
    readOnly?: boolean
}

type Props = {
    name: string
    prompt: string
    options: Option[]
    value: string
    setValue: (value: string) => void
    stopPropagation?: boolean
}

const MultiToggle = ({ name, prompt, options, value, setValue, stopPropagation = false }: Props) => {
    const handleChange: FormEventHandler<HTMLFieldSetElement> = (e) => {
        const input = e.target as HTMLInputElement
        setValue(input.value)
    }

    const onClick: MouseEventHandler = (e) => {
        if (stopPropagation) e.stopPropagation()
        // onClickProp(e)
    }

    return (
        <div className="inline-flex text-sm my-1 p-1 bg-back-alt/50 border-[0.5px] border-front/5 rounded-md transition-all duration-75">
            <fieldset onChange={handleChange} className="flex">
                <legend className="absolute [clip:rect(0,0,0,0)]">{prompt}</legend>
                {options.map((option) => {
                    const val = option.value ?? option.name
                    return (
                        <div key={option.name} className="" onClick={onClick}>
                            <input
                                className="peer appearance-none"
                                type="radio"
                                name={name}
                                id={option.name}
                                value={val}
                                checked={value === val}
                                readOnly={true} />
                            <label
                                className="inline-block cursor-pointer px-3 py-1 rounded text-front/70 hover:text-front/90 peer-checked:text-front/90 peer-checked:bg-back peer-checked:shadow-md peer-focus:outline outline-access outline-1"
                                htmlFor={option.name}>
                                {option.name}
                            </label>
                        </div>
                    )
                })}
            </fieldset>
        </div>
    )
}

export default MultiToggle