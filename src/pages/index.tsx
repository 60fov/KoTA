import { type NextPage } from "next";
import Head from "next/head";
import { cn } from "~/utils/fns";
import dynamic from "next/dynamic";

import AppMenu from "~/components/AppMenu";

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

        <div className="h-screen flex flex-col">
          <MainView />
        </div>

        <div className="absolute left-6 top-6">
          <AppMenu />
        </div>

      </main>
    </>
  );
};

export default Home;