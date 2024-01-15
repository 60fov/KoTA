import { cn } from "~/utils/fns"
import CmdKMenu from "../CmdK"
import AppMenu from "../AppMenu"
import Head from "next/head"
import Button from "../ui/Button"
import Dictionary from "../Dictionary"
import { HiOutlineBookOpen } from "react-icons/hi2"
import { useRef, useState } from "react"
import { useOnClickOutside } from "usehooks-ts"
import Dynamic from "../ui/Dynamic"
import Select from "../ui/Select"
import tts from "~/utils/tts"
import { Mode, modes, useModeStore, useTTSSettingsStore } from "~/utils/stores"
import { AnimatePresence, motion } from "framer-motion"

export default function RootLayout(page: React.ReactElement) {


  return (
    <>
      <Head>
        <title>KoTA</title>
        <meta name="description" content="a Korean typing web app" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>
      <main className={cn(
        "h-screen"
      )}>

        <Dynamic>
          <CmdKMenu />
        </Dynamic>

        {page}

        <div className="absolute top-6 left-6 right-6 flex items-center">
          <div className="grow flex items-start">
            <AppMenu />
          </div>
        </div>

        <DictionaryView />
        <Dynamic>
          <ModeChangeView />
        </Dynamic>

      </main>
    </>
  )
}

function VoiceView() {
  const ttsStore = useTTSSettingsStore()

  function onKrValueChange(value: string) {
    ttsStore.setKrVoiceId(value);
  }

  function onEnValueChange(value: string) {
    ttsStore.setEnVoiceId(value);
  }

  return (
    <div className="flex flex-col absolute bottom-6 left-48">
      <Select.Base name='tts-voice' onValueChange={onKrValueChange}>
        {
          tts.getVoicesByLang("ko-KR").map((voice) =>
            <Select.Option
              key={voice.voiceURI}
              value={tts.voiceId(voice)}>
              {`${voice.name} - ${voice.lang}`}
            </Select.Option>
          )
        }
      </Select.Base>
      <Select.Base name='tts-voice' onValueChange={onEnValueChange}>
        {
          tts.getVoicesByLang("en-US").map((voice) =>
            <Select.Option
              key={voice.voiceURI}
              value={tts.voiceId(voice)}>
              {`${voice.name} - ${voice.lang}`}
            </Select.Option>
          )
        }
      </Select.Base>
    </div>
  )
}

function DictionaryView() {
  const [showDictionary, setShowDictionary] = useState(false)

  // const baseRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useOnClickOutside(contentRef, () => {
    setShowDictionary(false)
  }, "mousedown")

  return (
    <div className="absolute inset-6 flex items-end justify-end pointer-events-none">
      <div ref={contentRef} className="relative flex flex-col items-end justify-end gap-2 h-full pointer-events-auto">
        <AnimatePresence>
          {showDictionary &&
            <motion.div
              initial={{ x: '110%' }}
              animate={{ x: 0 }}
              exit={{ x: '110%' }}
              // want grow but doesn't work 🤷‍♂️
              className="h-[80vh] w-full max-w-[384px] flex justify-end">
              <Dictionary />
            </motion.div>
          }
        </AnimatePresence>
        <Button
          onClick={() => setShowDictionary(!showDictionary)}>
          <HiOutlineBookOpen />
        </Button>
      </div>
    </div>
  )
}



function ModeChangeView() {
  const modeStore = useModeStore()
  
  const onValueChange = (value: string) => {
    modeStore.setMode(value as Mode)
  }

  return (
    <div className="absolute inset-6 flex items-end pointer-events-none">
      <div className="pointer-events-auto">
        <Select.Base name="mode" onValueChange={onValueChange} value={modeStore.mode}>
          {modes.map(mode =>
            <Select.Option key={mode} value={mode} />
          )}
        </Select.Base>
      </div>
    </div>
  )
}