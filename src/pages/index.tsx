import { type NextPage } from "next";

import KeyboardDisplay from "~/components/KeyboardDisplay";
import Dynamic from "~/components/Dynamic";
import MainView from "~/components/MainView";
import RootLayout from "~/components/layouts/RootLayout";

const Home: NextPage = () => {

  return (
    <RootLayout>
      <div className="h-screen flex flex-col items-center gap-16">
        <div className="h-1/2 w-[90%] max-w-6xl flex flex-col items-stretch justify-end">
          <Dynamic>
            <MainView />
          </Dynamic>
        </div>
        <div className="h-1/2">
          <Dynamic>
            <KeyboardDisplay />
          </Dynamic>
        </div>
      </div>
    </RootLayout>
  );
};

export default Home;