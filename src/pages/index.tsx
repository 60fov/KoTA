import RootLayout from "~/components/layouts/RootLayout";
import EndlessMode from "~/components/modes/Endless";
import { type NextPageWithLayout } from "./_app";
import BlocsMode from "~/components/modes/Blocs";
import Dynamic from "~/components/ui/Dynamic";
import { Mode, useModeStore } from "~/utils/stores";

const Home: NextPageWithLayout = () => {
  const { mode } = useModeStore();

  return (
    <>
      <div className="w-full h-full flex flex-col justify-center p-6">
        {
          mode &&
          <ModeView mode={mode} />
        }
      </div>
    </>
  );
};

function ModeView(props: { mode: Mode }) {

  function getMode(mode: Mode) {
    switch (mode) {
      case "Blocs": return <BlocsMode />
      case "Endless": return <EndlessMode />
    }
  }

  return (
    <Dynamic>
      {getMode(props.mode)}
    </Dynamic>
  )
}

Home.getLayout = RootLayout;

export default Home;
