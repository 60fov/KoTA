import { cn } from "~/utils/fns"
import CmdKMenu from "../CmdK"
import AppMenu from "../AppMenu"
import Head from "next/head"

export default function RootLayout(props: { children: React.ReactNode }) {
  const {
    children
  } = props

  return (
    <>
      <Head>
        <title>KoTA</title>
        <meta name="description" content="a Korean typing web app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={cn(
        "h-screen"
      )}>

        <CmdKMenu />

        {children}

        <div className="absolute top-6 left-6">
          <AppMenu />
        </div>

      </main>
    </>
  )
}