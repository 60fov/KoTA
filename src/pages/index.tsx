import { type NextPage } from "next";
import Head from "next/head";
import { cn } from "~/utils/fns";

import MainView from "~/components/MainView";
import AppMenu from "~/components/AppMenu";

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

        <div className="h-1/2 w-9/12 mx-auto flex flex-col justify-end">
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