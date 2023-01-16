import Keyboard from "./components/Keyboard"
import ModeDisplay from "./components/ModeDisplay"
import SettingsBar from "./components/SettingsBar"
import useTheme from "./hooks/useTheme"
import { useKeyboardSettingsStore } from "./util/stores"
import MobileWarning from "./components/MobileWarning"
import { AnimatePresence, LayoutGroup, motion } from "framer-motion"
import AlphaDisclaimer from "./components/AlphaDisclaimer"

// b4 release
// TODO: animations (wip)
// TODO: responsive
// TODO: correct feedback
// TODO: localstorage settings
// TODO: change game mode names
// TODO: switch to radix ui
// TODO: better toggle button indication
// TODO: git + readme + assets

// TODO: bugs
// shift flicker (verify)
// word block animation

// soon after
// TODO: directions
// TODO: imporoved focus indications
// TODO: rework input (lol)
// TODO: settings layout (cmd k maybe custom)
// TODO: theme menu
// TODO: about
// TODO: donate
// TODO: korean input support
// TODO: per mode settings

// misc
// TODO: tts format settings (e.g. speak word then definition)
// TODO: keyboard shortcuts (shown on keyboard)
// TODO: interact with keyboard?
// TODO: continuous current goal highlight
// TODO: sound effect
// TODO: animate caret better
// TODO: romaninzation fn (yale and rr at least + ipa + skats + maybe mr)

// big
// TODO: hangul tut
// TODO: mobile support
// TODO: timer + metrics
// TODO: account
// TODO: quality tts


function App() {
  const keyboardOn = useKeyboardSettingsStore((state) => state.visible)

  useTheme()

  return (
    <>
      <MobileWarning />
      <AlphaDisclaimer />

      {/* <div className="absolute left-10 top-0 whitespace-nowrap text-[400px] text-back/5">연습하다</div> */}
      <LayoutGroup>
        <motion.div layout className="h-screen mx-auto w-[700px] flex flex-col justify-center gap-6 px-4 md:p-0 z-10">

          <motion.div layout className="flex items-end justify-center grow">
            <AnimatePresence>
              <ModeDisplay />
            </AnimatePresence>
          </motion.div>

          <motion.div layout className="flex flex-col grow">
            <AnimatePresence>
              {
                keyboardOn ?
                  <motion.div key="keyboard" layout initial={{ opacity: 0, y: 0 }} animate={{ opacity: 1 }} exit={{ y: 50, opacity: 0 }}>
                    <Keyboard />
                  </motion.div>
                  :
                  <></>
              }
            </AnimatePresence>
          </motion.div>
          <motion.div layout className="mb-6">
            <SettingsBar />
          </motion.div>
        </motion.div>
      </LayoutGroup>
    </>

  )
}

export default App
