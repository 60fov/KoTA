import { AnimatePresence, LayoutGroup, motion } from "framer-motion"

import useTheme from "./hooks/useTheme"
import { useKeyboardSettingsStore } from "./util/stores"

import Keyboard from "./components/Keyboard"
import Display from "./components/Display"
import SettingsBar from "./components/SettingsBar"
import MobileWarning from "./components/MobileWarning"
import AlphaDisclaimer from "./components/AlphaDisclaimer"
import TestDisplay from "./components/TestDisplay"

// b4 release
// TODO: animations (wip)
// TODO: responsive
// TODO: toasts
// TODO: sfx
// TODO: timer + metrics
// TODO: block helper (togglable)
// TODO: user feedback
// TODO: git + readme + assets

// TODO: bugs
// shift flicker (verify)

// soon after
// TODO: patch notes
// TODO: theme menu
// TODO: about
// TODO: donate

// misc
// TODO: romaninzation fn (yale and rr at least + ipa + skats + maybe mr)
// TODO: keyboard shortcuts (+shown on keyboard)
// TODO: switch to radix ui (?)
// TODO: interact with keyboard (?)
// TODO: tts format settings (e.g. speak word then definition)

// big
// TODO: directions / hints / help
// TODO: settings layout (cmd k maybe custom)
// TODO: mobile support
// TODO: accounts
// TODO: quality tts
// TODO: hangul tut


function App() {
  const keyboardOn = useKeyboardSettingsStore((state) => state.visible)

  useTheme()

  return (
    <>
      <MobileWarning />
      <AlphaDisclaimer />

      <LayoutGroup>
        <motion.div layout className="h-screen mx-auto w-[700px] flex flex-col justify-center gap-6 px-4 md:p-0 z-10">

          <motion.div layout className="flex items-end justify-center grow">
            <Display />
            {/* <TestDisplay /> */}
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
