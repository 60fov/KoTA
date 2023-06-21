import DashboardLayout from "~/components/layouts/DashboardLayout";
import { type NextPageWithLayout } from "../_app";
import { useSession } from "next-auth/react";
import { WordList } from "~/utils/words";

import styles from "./Words.module.scss"
import Toggle from "~/components/ui/Toggle";
import Check from "~/components/icons/Check";
import React, { useEffect, useState } from "react";
import Input from "~/components/ui/Input";
import { HiMagnifyingGlass, HiXMark } from "react-icons/hi2";

import fuzzysort from 'fuzzysort';
import { decompose } from "lib/kime/jamo";
import { RadixIconsSpeakerLoud } from "~/components/icons/Speaker";
import { tts } from "~/utils/tts";
import Spacer from "~/components/ui/Spacer";
import { useTTSSettingsStore } from "~/utils/stores";


const Words: NextPageWithLayout = () => {
  const session = useSession({
    required: true,
  })

  const [wordList, setWordList] = useState(WordList)
  const [search, setSearch] = useState("")

  useEffect(() => {
    const wl = WordList.map((word) => {
      return {
        decomposedKr: decompose(word.kr).join(""),
        ...word
      }
    })

    const decomposedSearch = decompose(search).join("")

    const filteredWords = fuzzysort.go(decomposedSearch, wl, {
      keys: ["en", "decomposedKr"],
      all: true
    }).map(({ obj: { decomposedKr, ...word } }) => word)

    setWordList(filteredWords)

  }, [search])

  const handleSearchValueChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearch(e.currentTarget.value)
  }

  return (
    <>
      <Input
        placeholder="search"
        prefix={<HiMagnifyingGlass />}
        suffix={<HiXMark />}
        value={search}
        onChange={handleSearchValueChange}
      />
      <div className={styles.wordlist}>
        {wordList.map(word => (
          <Word word={word} key={word.kr + word.en} />
        ))}
        <div style={{ height: 64 }} />
      </div>
    </>
  )
}

function Word(props: { word: typeof WordList[number] }) {
  const {
    word
  } = props

  const [speaking, setSpeaking] = useState(false)
  const { pitch, rate, voice, volume } = useTTSSettingsStore()

  const handleClick: React.MouseEventHandler = () => {
    tts(word.kr, {
      lang: 'ko',
      force: true,
      pitch,
      rate,
      volume,
      voice,
      onstart: () => setSpeaking(true),
      onend: () => setSpeaking(false),
      onerror: () => setSpeaking(false),
    })
  }

  return (
    <div className={styles.word} onClick={handleClick}>
      <div data-label>
        <span data-kr>{word.kr}</span>
        <span data-en>{word.en}</span>
      </div>
      <Spacer.Flex flex="0 1 16px" />
      <div data-speaking-icon data-visible={speaking}>
        <RadixIconsSpeakerLoud />
      </div>
      <Spacer.Flex flex="1" />
      <Toggle><Check /></Toggle>
    </div>
  )
}

Words.getLayout = DashboardLayout;

export default Words;