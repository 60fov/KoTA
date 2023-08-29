import Menu from "~/components/ui/Menu";

import { nextThemeOption } from "~/utils/theme";

import Link from "next/link";

import Check from "./icons/Check";
import { useAudioSettingsStore, useKeyboardSettingsStore } from "~/utils/stores";
import { useTheme } from "~/hooks/useTheme";
import { RadixIconsMoon } from "./icons/Moon";
import { RadixIconsSun } from "./icons/Sun";
import { RadixIconsDesktop } from "./icons/Desktop";
import { HiHome } from "react-icons/hi2";
import { RadixIconsSpeakerLoud, RadixIconsSpeakerModerate, RadixIconsSpeakerOff, RadixIconsSpeakerQuiet } from "./icons/Speaker";
import KotaLogo from "./KotaLogo";
import { RadixIconsComponent1 } from "./icons/Component";

export default function AppMenu() {

  const [theme, setTheme] = useTheme()
  const [keyboardEnabled, setKeyboardEnabled] = useKeyboardSettingsStore(({ enabled, setEnabled }) => [enabled, setEnabled])
  // const [ttsEnabled, setTTSEnabled] = useTTSSettingsStore(({ enabled, setEnabled }) => [enabled, setEnabled])
  const audio = useAudioSettingsStore()


  const themeIcon = () => {
    switch (theme) {
      case "dark": return <RadixIconsMoon />
      case "light": return <RadixIconsSun />
      case "system": return <RadixIconsDesktop />
    }
  }

  const audioIcon = () => {
    if (!audio.enabled || audio.volume === 0) return <RadixIconsSpeakerOff />
    if (audio.volume < 0.34) return <RadixIconsSpeakerQuiet />
    if (audio.volume < 0.67) return <RadixIconsSpeakerModerate />
    return <RadixIconsSpeakerLoud />
  }

  function handleAudioClick() {
    if (!audio.enabled || audio.volume === 0) audio.setVolume(1)
    else if (audio.volume < 0.34) audio.setVolume(0)
    else if (audio.volume < 0.67) audio.setVolume(0.33)
    else audio.setVolume(0.66)
  }

  function handleThemeSwitch() {
    if (theme) setTheme(nextThemeOption(theme))
  }

  // function handleSettingsButton() {

  // }

  return (
    <Menu.Base>
      <Menu.Button variant="none">
        <KotaLogo size={32} />
      </Menu.Button>
      <Menu.Portal>
        <Menu.Section>
          <Menu.Item
            as={Link}
            href="/"
            icon={<HiHome />}
          >
            Home
          </Menu.Item>
          <Menu.Item
            as={Link}
            href="/design"
            icon={<RadixIconsComponent1 />}
          >
            Design
          </Menu.Item>
          <Menu.Divider />
          <Menu.Section title="options">
            <Menu.Item
              as="button"
              icon={themeIcon()}
              onClick={handleThemeSwitch}
              suffix={theme}
            >
              Change Theme
            </Menu.Item>
            <Menu.Item
              as="button"
              icon={audioIcon()}
              onClick={handleAudioClick}
              suffix={audio.getLevel()}
            >
              Sound Effects
            </Menu.Item>
            <Menu.Item.Toggle
              icon={<Check />}
              toggle={keyboardEnabled}
              onToggleChange={setKeyboardEnabled}
            >
              Show Keyboard
            </Menu.Item.Toggle>
            {/* <Menu.Item.Toggle
            icon={<Check />}
            toggle={ttsEnabled}
            onToggleChange={setTTSEnabled}
          >
            Enabled TTS
          </Menu.Item.Toggle> */}
            {/* <Menu.Item.Toggle icon={<Check />}>Show Decomposed</Menu.Item.Toggle> */}
          </Menu.Section>
        </Menu.Section>
        {/* <Menu.Item
          as="button"
          icon={<RadixIconsGear />}
          // onClick={handleSettingsButton}
        >
          Settings
        </Menu.Item> */}
      </Menu.Portal>
    </Menu.Base>
  )
}