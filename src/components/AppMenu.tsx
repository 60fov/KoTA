import Menu from "~/components/ui/Menu";
import Dashboard from "~/components/icons/Dashboard";
import Person from "~/components/icons/Person";


import { setTheme, themeList, type Theme } from "~/utils/theme";
import Check from "~/components/icons/Check";
import Desktop from "~/components/icons/Desktop";
import Sun from "~/components/icons/Sun";
import Moon from "~/components/icons/Moon";
import { useState } from "react";


export default function AppMenu() {
  const [themeState, setThemeState] = useState<Theme>("system")

  const themeIcon = () => {
    switch (themeState) {
      case "dark": return <Moon />
      case "light": return <Sun />
      case "system": return <Desktop />
    }
  }

  function handleThemeSwitch() {
    const theme = themeList[(themeList.indexOf(themeState) + 1) % themeList.length] as Theme
    setThemeState(theme)
    setTheme(theme)
  }

  return (
    <Menu.Base>
      <Menu.Button />
      <Menu.Portal>
        <Menu.Item
          as="button"
          icon={themeIcon()}
          onClick={handleThemeSwitch}
          className="capitalize"
          suffix={themeState}
        >
          Change Theme
        </Menu.Item>
        <Menu.Divider />
        <Menu.Section>
          <Menu.Item.Toggle icon={<Check />}>Show Keyboard</Menu.Item.Toggle>
          <Menu.Item.Toggle icon={<Check />}>Enable TTS</Menu.Item.Toggle>
          <Menu.Item.Toggle icon={<Check />}>Show Decomposed</Menu.Item.Toggle>
        </Menu.Section>
        <Menu.Divider />
        <Menu.Section title="account">
          <Menu.Item as="button" icon={<Person />} disabled>sign-in</Menu.Item>
          <Menu.Item as="button" icon={<Dashboard />} disabled >dashboard</Menu.Item>
        </Menu.Section>
      </Menu.Portal>
    </Menu.Base>
  )
}
