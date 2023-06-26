import { Command } from 'cmdk'
import { useEffect, useRef, useState } from 'react'
import Keyboard from './icons/Keyboard'

import { useKeyboardSettingsStore, useThemeStore } from '~/utils/stores'
import { nextThemeOption } from '~/utils/theme'
import { RadixIconsDesktop } from './icons/Desktop'



// import styles from './CmdK.module.scss'

const CmdKMenu = () => {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [search, setSearch] = useState("")

  const refCmdKDiag = useRef(null)

  const [keyboardEnabled, setKeyboardEnabled] = useKeyboardSettingsStore(({ enabled, setEnabled }) => [enabled, setEnabled])
  const [theme, setTheme] = useThemeStore(({ value, set }) => [value, set])

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <>
      {/* <Button variant='passive' icon={<HBMenu />} onClick={() => setOpen(!open)} /> */}
      <Command.Dialog
        ref={refCmdKDiag}
        open={open}
        onOpenChange={setOpen}
        value={value}
        onValueChange={setValue}
      >
        <Command.Input placeholder="what's up?" value={search} onValueChange={setSearch} />

        <Command.Separator alwaysRender />
        {/* <div className={"bg-gradient-to-r from-transparent via-front-alt to-transparent h-[0.5px]"} /> */}

        <Command.List>
          {/* {loading && <Command.Loading>Hang on…</Command.Loading>} */}

          <Command.Empty>No results found.</Command.Empty>

          <Command.Group heading="Options">
            <Command.Item onSelect={() => setKeyboardEnabled(!keyboardEnabled)}>
              <Keyboard />
              <p>Keyboard</p>
              <div cmdk-item-state-display="">
                {keyboardEnabled ? "on" : "off"}
              </div>
            </Command.Item>
            <Command.Item>
              Text-To-Speech
            </Command.Item>
            <Command.Item value={theme} onSelect={() => setTheme(nextThemeOption(theme))}>
              <div className="icon-wrapper">
                <RadixIconsDesktop />
              </div>
              <p>
                Theme
              </p>
              <div cmdk-item-state-display="">
                {theme}
              </div>
            </Command.Item>
          </Command.Group>

          <Command.Group heading="Profile">
            <Command.Item>Dashboard</Command.Item>
            <Command.Item>Account</Command.Item>
            <Command.Item>Sign-Out</Command.Item>
          </Command.Group>

        </Command.List>
      </Command.Dialog>
    </>
  )
}


export default CmdKMenu