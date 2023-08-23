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

import LeftArrow from "~/components/icons/LeftArrow";
import RightArrow from "~/components/icons/RightArrow";
import Plus from "~/components/icons/Plus";
import Minus from "~/components/icons/Minus";
import Menu from "~/components/ui/Menu";
import { RadixIconsMoon } from "~/components/icons/Moon";

import { cn, min, max, random } from "~/utils/fns";

import alluraGlare from "@/images/allura_glare.jpg"
import Input from "~/components/ui/Input";
import toast from "~/components/Toast";
import Dynamic from "~/components/Dynamic";
import { useTheme } from "~/hooks/useTheme";
import { RadixIconsSun } from "~/components/icons/Sun";
import { RadixIconsDesktop } from "~/components/icons/Desktop";

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
            <KotaIcon />
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
              <MultiToggle.Item value="light"><RadixIconsSun /></MultiToggle.Item>
              <MultiToggle.Item value="dark"><RadixIconsMoon /></MultiToggle.Item>
              <MultiToggle.Item value="system"><RadixIconsDesktop /></MultiToggle.Item>
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
                  <Menu.Item.Toggle icon={<Plus />}>Toggle Option 3</Menu.Item.Toggle>
                </Menu.Section>
                <Menu.Divider />
                <Menu.Item as="button" icon={<RadixIconsMoon />}>Button With Icon</Menu.Item>
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
                  prefix={<LeftArrow />}
                />
                <Button onClick={removeWord}
                  prefix={<Minus />} />
                <Button onClick={() => setSliderOpen(!sliderOpen)}>{sliderOpen ? "close" : "open"}</Button>
                <Button
                  onClick={() => { setWords([...words, randomWord()]) }}
                  prefix={<Plus />} />
                <Button
                  onClick={() => setSliderIndex(min(sliderIndex + 1, words.length - 1))}
                  prefix={<RightArrow />}
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

function KotaIcon() {
  return (
    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>
        {`
        #top { fill: url(#gradientTopLight); }
        #bot { fill: url(#gradientBotLight); }
        @media (prefers-color-scheme: dark) {
          #top { fill: url(#gradientTopDark); }
          #bot { fill: url(#gradientBotDark); }
        }
      `}
      </style>
      <mask id="shape-mask" fill="white">
        <path d="M0 25.6C0 16.6392 0 12.1587 1.7439 8.73615C3.27787 5.72556 5.72556 3.27787 8.73615 1.7439C12.1587 0 16.6392 0 25.6 0H74.4C83.3608 0 87.8413 0 91.2638 1.7439C94.2744 3.27787 96.7221 5.72556 98.2561 8.73615C100 12.1587 100 16.6392 100 25.6V74.4C100 83.3608 100 87.8413 98.2561 91.2638C96.7221 94.2744 94.2744 96.7221 91.2638 98.2561C87.8413 100 83.3608 100 74.4 100H25.6C16.6392 100 12.1587 100 8.73615 98.2561C5.72556 96.7221 3.27787 94.2744 1.7439 91.2638C0 87.8413 0 83.3608 0 74.4V25.6Z" />
      </mask>
      <path id="top" d="M0 25.6C0 16.6392 0 12.1587 1.7439 8.73615C3.27787 5.72556 5.72556 3.27787 8.73615 1.7439C12.1587 0 16.6392 0 25.6 0H74.4C83.3608 0 87.8413 0 91.2638 1.7439C94.2744 3.27787 96.7221 5.72556 98.2561 8.73615C100 12.1587 100 16.6392 100 25.6V74.4C100 83.3608 100 87.8413 98.2561 91.2638C96.7221 94.2744 94.2744 96.7221 91.2638 98.2561C87.8413 100 83.3608 100 74.4 100H25.6C16.6392 100 12.1587 100 8.73615 98.2561C5.72556 96.7221 3.27787 94.2744 1.7439 91.2638C0 87.8413 0 83.3608 0 74.4V25.6Z" />
      <path id="bot" mask="url(#shape-mask)" d="M0 0H100H0ZM100 84C100 96.1503 90.1503 106 78 106H22C9.84974 106 0 96.1503 0 84C0 89.5228 7.16344 94 16 94H84C92.8366 94 100 89.5228 100 84ZM0 100V0V100ZM100 0V100V0Z" />
      <defs>
        <linearGradient id="gradientTopDark" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2C2B2B" />
          <stop offset="1" stopColor="#383838" />
        </linearGradient>
        <linearGradient id="gradientBotDark" x1="50" y1="86" x2="50" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#353535" />
          <stop offset="1" stopColor="#1C1C1C" />
        </linearGradient>
        <linearGradient id="gradientTopLight" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E6E6E6" />
          <stop offset="1" stopColor="#F2F2F2" />
        </linearGradient>
        <linearGradient id="gradientBotLight" x1="50" y1="86.5" x2="50" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E8E8E8" />
          <stop offset="1" stopColor="#B5B5B5" />
        </linearGradient>
      </defs>
    </svg>
  )
}