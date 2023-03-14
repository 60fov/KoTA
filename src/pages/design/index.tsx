import type { NextPage } from "next";
import { type ReactNode, useState } from "react";
import Head from "next/head";

import { HiComputerDesktop, HiMoon, HiOutlineFaceSmile, HiSun } from "react-icons/hi2"

// import type { CSSVariableProperties } from "~/utils/types";
import Toggle from "~/components/ui/Toggle";
import { cn, min, max, random } from "~/utils/fns";
import MultiToggle from "~/components/ui/MultiToggle";
import Key from "~/components/ui/Key";
import Select from "~/components/ui/Select";
import Button from "~/components/ui/Button";
import { setTheme, type Theme } from "~/utils/theme";
import Slider from "~/components/ui/Slider";
import LeftArrow from "~/components/icons/LeftArrow";
import RightArrow from "~/components/icons/RightArrow";
import Plus from "~/components/icons/Plus";
import Minus from "~/components/icons/Minus";
import Menu from "~/components/ui/Menu";
import Moon from "~/components/icons/Moon";


const Home: NextPage = () => {

  const [themeState, setThemeState] = useState<Theme>("dark")

  const wordList =
    "Be yourself as often as possible as you are all you have to offer."
      // "슬라이더, 우리 다시 만나요. 이것은 흥미로울 것이다. 나는 누가 결국 승리를 거둘 것인지 궁금하다."
      .split(" ")


  const [words, setWords] = useState(wordList.map(word => ({ word, id: random.nano() })))
  const [sliderIndex, setSliderIndex] = useState(0)
  const [sliderOpen, setSliderOpen] = useState(true)

  function randomWord() {
    const word = random.fromArray(wordList, "???")
    const id = random.nano()
    return { word, id }
  }

  function removeWord() {
    if (words.length > 1) {
      setWords(words.slice(1))
      if (sliderIndex > 0) setSliderIndex(sliderIndex - 1)
    }
  }

  return (
    <>
      <Head>
        <title>Kota @ Design</title>
        <meta name="description" content="components for Kota, a korean typing app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={cn(
        "bg-front bg-dotted [background-size:40px_40px] min-h-screen h-content",
      )}>
        <div className={cn(
          "max-w-4xl mx-auto py-16",
          "grid [grid-auto-flow:row dense] [grid-template-columns:repeat(4,1fr)] gap-4 auto-rows-[200px]",
        )}>
          <Tile name="Toggle">
            <Toggle>
              <HiOutlineFaceSmile />
            </Toggle>
          </Tile>

          <Tile name="Multi-Toggle">
            <MultiToggle.Base
              name="mutlitoggle example"
              value={themeState}
              onValueChange={(newTheme) => {
                setTheme(newTheme)
                setThemeState(newTheme)
              }}
              prompt="this is just an example of a multi-toggle button" >
              <MultiToggle.Item value="light"><HiSun /></MultiToggle.Item>
              <MultiToggle.Item value="dark"><HiMoon /></MultiToggle.Item>
              <MultiToggle.Item value="system"><HiComputerDesktop /></MultiToggle.Item>
            </MultiToggle.Base>
          </Tile>

          <Tile name="Key">
            <Key label="ㄹ" code="f" />
          </Tile>
          <Tile name="Select">
            <Select.Base name="example">
              <Select.Option value="one">one</Select.Option>
              <Select.Option value="two">two</Select.Option>
              <Select.Option value="three" />
              <Select.Option value="fourteen" />
              <Select.Option value="d">d</Select.Option>
            </Select.Base>
          </Tile>
          <Tile name="Button">
            <Button>click me</Button>
          </Tile>
          {/* <Tile className="col-span-2 row-span-2">
            <Container
              title="Title"
              desc="this is a description of the contents of the container."
            >
             
            </Container>
          </Tile> */}
          {/* <Tile></Tile> */}
          {/* <Tile></Tile> */}
          <Tile name="Menu">
            <Menu.Base>
              <Menu.Button />
              <Menu.Portal>
                <Menu.Section>
                  <Menu.Item.Toggle>Toggle Option 1</Menu.Item.Toggle>
                  <Menu.Item.Toggle initialToggle>Toggle Option 2</Menu.Item.Toggle>
                  <Menu.Item.Toggle icon={<Plus />}>Toggle Option 3</Menu.Item.Toggle>
                </Menu.Section>
                <Menu.Divider />
                <Menu.Item as="button" icon={<Moon />}>Button With Icon</Menu.Item>
                <Menu.Item as="button">Button without Icon</Menu.Item>
                <Menu.Section title="section title">
                  <Menu.Item as="button" disabled>Disabled Button</Menu.Item>
                </Menu.Section>
              </Menu.Portal>
            </Menu.Base>
          </Tile>
          <Tile name="Slider" className="col-span-4">
            <div className="w-full flex flex-col gap-6 items-center">
              <Slider.Base index={sliderIndex} open={sliderOpen}>
                {
                  words.map(({ word, id }) => (
                    <Slider.Item
                      id={id}
                      key={id}
                    // onViewLeave={() => console.log(word, "left")}
                    // onViewEnter={() => console.log(word, "enter")}
                    >
                      {word}
                    </Slider.Item>
                  ))
                }
              </Slider.Base>
              <div className="flex gap-2">
                <Button
                  onClick={() => setSliderIndex(max(sliderIndex - 1, 0))}
                  icon={<LeftArrow />}
                />
                <Button onClick={removeWord}
                  icon={<Minus />} />
                <Button onClick={() => setSliderOpen(!sliderOpen)}>{sliderOpen ? "close" : "open"}</Button>
                <Button
                  onClick={() => { setWords([...words, randomWord()]) }}
                  icon={<Plus />} />
                <Button
                  onClick={() => setSliderIndex(min(sliderIndex + 1, words.length - 1))}
                  icon={<RightArrow />}
                />
              </div>
            </div>
          </Tile>
        </div>
      </main>
    </>
  );
};

export default Home;

interface Props {
  name?: string
  className?: string
  children?: ReactNode
}

const Tile = (props: Props) => {
  const { name, className, children } = props;
  return (
    <div
      className={cn(
        "relative p-12",
        "size-base flex gap-4 items-center justify-center p-var",
        "border border-front/10 bg-back rounded-v",
        className
      )}
    // style={{ "--padding": "12px" } as CSSVariableProperties}
    >
      {children}
      <span className="absolute bottom-v left-v text-neutral-400">{name}</span>
    </div>
  )
}
