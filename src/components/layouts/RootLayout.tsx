import { cn } from "~/utils/fns"
import CmdKMenu from "../CmdK"
import AppMenu from "../AppMenu"
import Head from "next/head"
import Button from "../ui/Button"
import KotaLogo from "../KotaLogo"

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

      </main>
    </>
  )
}