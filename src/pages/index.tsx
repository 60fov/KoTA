import { type NextPage } from "next";
import Head from "next/head";
import { cn } from "~/utils/fns";
import dynamic from "next/dynamic";

import AppMenu from "~/components/AppMenu";
import CmdKMenu from "~/components/CmdK";
import KeyboardDisplay from "~/components/KeyboardDisplay";

const MainView = dynamic(() => import("~/components/MainView"), {
  ssr: false
})

const Home: NextPage = () => {

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

        <div className="h-screen flex flex-col items-center gap-16">
          <div className="h-1/2 w-[90%] max-w-6xl flex flex-col items-stretch justify-end">
            <MainView />
          </div>
          <div className="h-1/2">
            <KeyboardDisplay />
          </div>
        </div>

        <div className="absolute top-6 left-6">
          <AppMenu />
        </div>

      </main>
    </>
  );
};

export default Home;