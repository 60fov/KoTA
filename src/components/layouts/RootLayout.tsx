import { cn } from "~/utils/fns"
import CmdKMenu from "../CmdK"
import AppMenu from "../AppMenu"
import Head from "next/head"
import Button from "../ui/Button"
import Dictionary from "../Dictionary"
import { HiOutlineBookOpen } from "react-icons/hi2"
import { useRef, useState } from "react"
import { useOnClickOutside } from "usehooks-ts"
import Dynamic from "../Dynamic"
import Select from "../ui/Select"
import tts from "~/utils/tts"
import { useTTSSettingsStore } from "~/utils/stores"
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
            {/* <KotaLogo size={32} /> */}
            <AppMenu />
          </div>
        </div>

        {/* <Dynamic>
          <VoiceView />
        </Dynamic> */}

        <DictionaryView></DictionaryView>

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

  const baseRef = useRef<HTMLDivElement>(null)

  useOnClickOutside(baseRef, () => {
    setShowDictionary(false)
  }, "mousedown")

  return (
    <div ref={baseRef} className="absolute bottom-6 right-6 flex flex-col items-end justify-end gap-2">
      <AnimatePresence>
        {showDictionary &&
          <motion.div
            
            initial={{ x: '110%' }}
            animate={{ x: 0 }}
            exit={{ x: '110%' }}
            className="h-[800px] w-[384px] flex justify-end">
            <Dictionary />
          </motion.div>
        }
      </AnimatePresence>
      <Button
        onClick={() => setShowDictionary(!showDictionary)}>
        <HiOutlineBookOpen />
      </Button>
    </div>
  )
}