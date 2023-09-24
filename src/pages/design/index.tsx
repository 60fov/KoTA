import type { NextPage } from "next";
import { type ReactNode, useState } from "react";
import Head from "next/head";

import { HiOutlineFaceSmile, HiMagnifyingGlass, HiXMark } from "react-icons/hi2"

// import type { CSSVariableProperties } from "~/utils/types";
import Toggle from "~/components/ui/Toggle";
import MultiToggle from "~/components/ui/MultiToggle";
import Key from "~/components/ui/Key";
import Select from "~/components/ui/Select";
import Button from "~/components/ui/Button";
import Slider from "~/components/ui/Slider";
import UserCard from "~/components/UserCard";

import Menu from "~/components/ui/Menu";

import { cn, min, max, random } from "~/utils/fns";

import alluraGlare from "@/images/allura_glare.jpg"
import Input from "~/components/ui/Input";
import toast from "~/components/Toast";
import Dynamic from "~/components/Dynamic";
import { useTheme } from "~/hooks/useTheme";
import KotaLogo from "~/components/KotaLogo";
import RadixIcons from "~/components/icons/RadixIcons";

const Home: NextPage = () => {
  const [theme, setTheme] = useTheme()

  const wordList =
    "be yourself as often as possible as you are all you have to offer."
      // "슬라이더, 우리 다시 만나요. 이것은 흥미로울 것이다. 나는 누가 결국 승리를 거둘 것인지 궁금하다."
      .split(" ")


  const [words, setWords] = useState(wordList.map(word => ({ word, id: random.nano() })))
  const [sliderIndex, setSliderIndex] = useState(0)
  const [sliderOpen, setSliderOpen] = useState(true)

  function randomWord() {
    const word = random.fromArrayOrDefault(wordList, "???")
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
      </Head>
      <main className={cn(
        "bg-front bg-dotted [background-size:40px_40px] h-screen overflow-auto",
      )}>
        <div className={cn(
          "max-w-4xl mx-auto py-8",
          "grid [grid-auto-flow:row dense] [grid-template-columns:repeat(4,1fr)] gap-4 auto-rows-[200px]",
        )}>
          <Tile name="Logo" className="">
            <KotaLogo />
          </Tile>

          <Tile name="Key">
            <Dynamic>
              <Key label="ㄹ" code="f" />
            </Dynamic>
          </Tile>

          <Tile name="User Card" className="row-span-3 col-span-2 col-start-3">
            <UserCard
              handle={"ily"}
              wpm={123}
              wordsTyped={152342}
              accuracy={.93}
              image={alluraGlare.src}
              loading={true} />
          </Tile>

          <Tile name="Input" className="col-span-2">
            <Input
              label={"label"}
              prefix={<HiMagnifyingGlass />}
              suffix={<HiXMark />}
              defaultValue={"hello"}
              placeholder="placeholder" />
          </Tile>

          <Tile name="Toggle">
            <Toggle defaultValue={true}>
              <HiOutlineFaceSmile />
            </Toggle>
          </Tile>

          <Tile name="Toast">
            <Button onClick={() => { toast.pop("Congrats on your Toast!", "you successfully pop'd a toast, time to celebrate! 🎉") }}>Pop Toast</Button>
          </Tile>

          <Tile name="Multi-Toggle">
            <MultiToggle.Base
              name="mutlitoggle example"
              defaultValue="system"
              value={theme}
              onValueChange={(newTheme) => {
                if (newTheme) setTheme(newTheme)
              }}
              prompt="this is just an example of a multi-toggle button"
            >
              <MultiToggle.Item value="light"><RadixIcons.Sun /></MultiToggle.Item>
              <MultiToggle.Item value="dark"><RadixIcons.Moon /></MultiToggle.Item>
              <MultiToggle.Item value="system"><RadixIcons.Desktop /></MultiToggle.Item>
            </MultiToggle.Base>
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

          <Tile name="Menu">
            <Menu.Base>
              <Menu.Button />
              <Menu.Portal>
                <Menu.Section>
                  <Menu.Item.Toggle>Toggle Option 1</Menu.Item.Toggle>
                  <Menu.Item.Toggle initialToggle>Toggle Option 2</Menu.Item.Toggle>
                  <Menu.Item.Toggle icon={<RadixIcons.Plus />}>Toggle Option 3</Menu.Item.Toggle>
                </Menu.Section>
                <Menu.Divider />
                <Menu.Item as="button" icon={<RadixIcons.Moon />}>Button With Icon</Menu.Item>
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
                  prefix={<RadixIcons.ArrowLeft />}
                />
                <Button onClick={removeWord}
                  prefix={<RadixIcons.Minus />} />
                <Button onClick={() => setSliderOpen(!sliderOpen)}>{sliderOpen ? "close" : "open"}</Button>
                <Button
                  onClick={() => { setWords([...words, randomWord()]) }}
                  prefix={<RadixIcons.Plus />} />
                <Button
                  onClick={() => setSliderIndex(min(sliderIndex + 1, words.length - 1))}
                  prefix={<RadixIcons.ArrowRight />}
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