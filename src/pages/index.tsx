import KeyboardDisplay from "~/components/KeyboardDisplay";
import Dynamic from "~/components/Dynamic";
import RootLayout from "~/components/layouts/RootLayout";
import EndlessMode from "~/components/Endless";
import { type NextPageWithLayout } from "./_app";
import Dict from "~/utils/dictionary";
import { nanoid } from "nanoid";
import { useMemo } from "react";

const Home: NextPageWithLayout = () => {

  const pool = useMemo(() => {
    return Dict.entries.map(word => ({ ...word, id: nanoid() }))
  }, [])

  return (
    <div className="h-screen flex flex-col items-center gap-16">
      <div className="h-1/2 w-[90%] max-w-6xl flex flex-col items-stretch justify-end">
        <Dynamic>
          <EndlessMode pool={pool}>
            <EndlessMode.Translation />
            <EndlessMode.Slider />
            <EndlessMode.Input />
          </EndlessMode>
        </Dynamic>
      </div>
      <div className="h-1/2">
        <Dynamic>
          <KeyboardDisplay />
        </Dynamic>
      </div>
    </div>
  );
};

Home.getLayout = RootLayout;

export default Home;