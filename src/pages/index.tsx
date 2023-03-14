import { type NextPage } from "next";
import Head from "next/head";
import { cn, random } from "~/utils/fns";


import Menu from "~/components/ui/Menu";
import Dashboard from "~/components/icons/Dashboard";
import Person from "~/components/icons/Person";

import { useState } from "react";
import { setTheme, themeList, type Theme } from "~/utils/theme";
import Check from "~/components/icons/Check";
import Desktop from "~/components/icons/Desktop";
import Sun from "~/components/icons/Sun";
import Moon from "~/components/icons/Moon";


const Home: NextPage = () => {

  return (
    <>
      <Head>
        <title>krit</title>
        <meta name="description" content="a Korean typing web app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={cn(
        "h-screen",
      )}>

        <MainView />

        <div className="absolute left-6 top-6">
          <AppMenu />
        </div>

      </main>
    </>
  );
};

export default Home;

import Slider from "~/components/ui/Slider";
import { WordList } from "~/utils/words";

// DISPLAY
function MainView() {

  const [wordList, setWordList] = useState(listOf(randomWord, 5))
  const [index, setIndex] = useState(0)

  function listOf<T>(fn: () => T, length: number): T[] {
    const result: T[] = []
    for (let i = 0; i < length; i++) {
      result.push(fn())
    }
    return result
  }

  function randomWord() {
    return {
      ...random.fromArray(WordList, { kr: "??", roman: "??", en: "??", }),
      id: random.nano()
    }
  }

  return (
    <div className="h-full max-w-4xl mx-auto flex items-center justify-center">
      <Slider.Base index={index}>
        {
          wordList.map(word => (
            <Slider.Item id={word.id} key={word.id}>{word.kr}</Slider.Item>
          ))
        }
      </Slider.Base>
    </div>
  )
}

interface InputFieldProps {
  goal?: string

}

// INPUT FIELD
function InputField(props: InputFieldProps) {
  const {
    goal
  } = props

  

  return (
    <div>
      <input type="text" />
    </div>
  )
}



// APP MENU

function AppMenu() {
  const [themeState, setThemeState] = useState<Theme>("system")

  const themeIcon = () => {
    switch (themeState) {
      case "dark": return <Moon />
      case "light": return <Sun />
      case "system": return <Desktop />
    }
  }

  function handleThemeSwitch() {
    const theme = themeList[(themeList.indexOf(themeState) + 1) % themeList.length] as Theme
    setThemeState(theme)
    setTheme(theme)
  }

  return (
    <Menu.Base>
      <Menu.Button />
      <Menu.Portal>
        <Menu.Item
          as="button"
          icon={themeIcon()}
          onClick={handleThemeSwitch}
          className="capitalize"
          suffix={themeState}
        >
          Change Theme
        </Menu.Item>
        <Menu.Divider />
        <Menu.Section>
          <Menu.Item.Toggle icon={<Check />}>Show Keyboard</Menu.Item.Toggle>
          <Menu.Item.Toggle icon={<Check />}>Enable TTS</Menu.Item.Toggle>
          <Menu.Item.Toggle icon={<Check />}>Show Decomposed</Menu.Item.Toggle>
        </Menu.Section>
        <Menu.Divider />
        <Menu.Section title="account">
          <Menu.Item as="button" icon={<Person />} disabled>sign-in</Menu.Item>
          <Menu.Item as="button" icon={<Dashboard />} disabled >dashboard</Menu.Item>
        </Menu.Section>
      </Menu.Portal>
    </Menu.Base >
  )
}
