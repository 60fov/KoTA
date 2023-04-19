import { isMode, useDisplaySettingsStore, useKeyboardSettingsStore, useModeStore, useThemeStore, useTTSSettingsStore } from "../util/stores"
import ToggleButton from "./ui/ToggleButton"
import { BsGripHorizontal, BsKeyboard, BsLaptop, BsMoonStars, BsSoundwave, BsSun } from 'react-icons/bs'
import MultiToggleButton from "./ui/MutliToggleButton"

const SettingsBar = () => {
    const [keyboardVisible, setKeyboardVisible] = useKeyboardSettingsStore((state) => [state.visible, state.setVisible])
    const [ttsEnabled, setTTSEnabled] = useTTSSettingsStore((state) => [state.enabled, state.setEnabled])
    const [theme, setTheme] = useThemeStore((state) => [state.theme, state.setTheme])

    const [showDecomposed, setShowDecomposed] = useDisplaySettingsStore((state) => [state.showDecomposed, state.setShowDecomposed])


    return (
        <div className="flex gap-1">
            <div className="mr-auto flex gap-1">
                <ToggleButton
                    pressed={ttsEnabled}
                    onToggle={(on: boolean) => (setTTSEnabled(on))}>
                    <BsSoundwave />
                </ToggleButton>

                <ToggleButton
                    pressed={keyboardVisible}
                    onToggle={(on: boolean) => (setKeyboardVisible(on))}>
                    <BsKeyboard />
                </ToggleButton>

                <ToggleButton
                    pressed={showDecomposed}
                    onToggle={(on: boolean) => (setShowDecomposed(on))}>
                    <BsGripHorizontal />
                </ToggleButton>
            </div>


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