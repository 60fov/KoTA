import { isMode, useKeyboardSettingsStore, useModeStore, useThemeStore, useTTSSettingsStore } from "../util/stores"
import MultiToggle from "./ui/MultiToggle"
import ToggleButton from "./ui/ToggleButton"
import { BsKeyboard, BsLaptop, BsMoonStars, BsSoundwave, BsSun } from 'react-icons/bs'
import MultiToggleButton from "./ui/MutliToggleButton"

const SettingsBar = () => {
    const [mode, setMode] = useModeStore((state) => [state.mode, state.setMode])
    const [keyboardVisible, setKeyboardVisible] = useKeyboardSettingsStore((state) => [state.visible, state.setVisible])
    const [ttsEnabled, setTTSEnabled] = useTTSSettingsStore((state) => [state.enabled, state.setEnabled])
    const [theme, setTheme] = useThemeStore((state) => [state.theme, state.setTheme])

    const setModeValue = (value: string) => {
        if (isMode(value)) setMode(value)
        else console.error(`invalid mode: ${value}`)
    }

    return (
        <div className="flex gap-1">
            <div className="mr-auto flex">
                <MultiToggleButton.Base
                    name="mode"
                    prompt="select mode"
                    value={mode}
                    setValue={setModeValue}>
                    <MultiToggleButton.Item value={"jamo"} />
                    <MultiToggleButton.Item value={"word"} />
                    <MultiToggleButton.Item value={"multi-word"} />
                </MultiToggleButton.Base>
            </div>

            <ToggleButton
                pressed={ttsEnabled}
                onToggle={(on: boolean) => (setTTSEnabled(on))}>
                <BsSoundwave />
            </ToggleButton>
            
            {/* <ToggleButton
                pressed={keyboardVisible}
                onToggle={(on: boolean) => (setKeyboardVisible(on))}>
                <BsKeyboard />
            </ToggleButton> */}

            <MultiToggleButton.Base
                name={"theme"}
                prompt={"select theme"}
                value={theme}
                setValue={setTheme}>
                <MultiToggleButton.Item value={"system"}>
                    <BsLaptop />
                </MultiToggleButton.Item>
                <MultiToggleButton.Item value={"light"}>
                    <BsSun />
                </MultiToggleButton.Item>
                <MultiToggleButton.Item value={"dark"}>
                    <BsMoonStars />
                </MultiToggleButton.Item>
            </MultiToggleButton.Base>
        </div>
    )
}

export default SettingsBar