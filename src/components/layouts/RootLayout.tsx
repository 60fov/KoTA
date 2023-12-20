import { cn } from "~/utils/fns"
import CmdKMenu from "../CmdK"
import AppMenu from "../AppMenu"
import Head from "next/head"
import Button from "../ui/Button"
import Dictionary from "../Dictionary"
import { HiOutlineBookOpen } from "react-icons/hi2"
import { useRef, useState } from "react"
import { useOnClickOutside } from "usehooks-ts"

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

        <CmdKMenu />

        {page}

        <div className="absolute top-6 left-6 right-6 flex items-center">
          <div className="grow flex items-start">
            {/* <KotaLogo size={32} /> */}
            <AppMenu />
          </div>
        </div>


        <DictionaryView></DictionaryView>

      </main>
    </>
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
      {showDictionary &&
        <div className="h-[800px] w-[384px] flex justify-end">
          <Dictionary />
        </div>
      }
      <Button
        onClick={() => setShowDictionary(!showDictionary)}>
        <HiOutlineBookOpen />
      </Button>
    </div>
  )
}