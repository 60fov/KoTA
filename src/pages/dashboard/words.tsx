import DashboardLayout from "~/components/layouts/DashboardLayout";
import { type NextPageWithLayout } from "../_app";
import { useSession } from "next-auth/react";

import styles from "./Words.module.scss"
import Toggle from "~/components/ui/Toggle";
import Check from "~/components/icons/Check";
import React, { useEffect, useState } from "react";
import Input from "~/components/ui/Input";
import { HiMagnifyingGlass, HiXMark } from "react-icons/hi2";

import fuzzysort from 'fuzzysort';
import { decompose } from "lib/kime/jamo";
import { RadixIconsSpeakerLoud } from "~/components/icons/Speaker";
import Spacer from "~/components/ui/Spacer";
import { useTTSSettingsStore, useWordTableStore } from "~/utils/stores";
import { type WordType } from "~/utils/words";
import { type Controllable } from "~/components/ui/types";
import useClientStore from "~/utils/hooks/useClientStore";
import { AnimatePresence, motion } from "framer-motion";
import tts from "~/utils/tts";

const Words: NextPageWithLayout = () => {
  const session = useSession({
    required: true,
  })

  const { wordTable, setWord, hydrated: wordTableHydrated } = useClientStore(useWordTableStore, (state) => state)
  const [wordList, setWordList] = useState(Object.values(wordTable))
  const [search, setSearch] = useState("")

  useEffect(() => {
    void useWordTableStore.persist.rehydrate()
  }, [])

  useEffect(() => {
    const wl = Object.values(wordTable).map((word) => {
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

  }, [search, wordTable])

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
        <AnimatePresence>
          {wordTableHydrated ? (
            wordList.map(word => (
              <Word
                key={word.key}
                word={word}
                value={word.enabled}
                onValueChange={value => setWord(word.key, { ...word, enabled: value })} />
            ))
          ) : (
            <>
              <Word.Skeleton />
              <Word.Skeleton />
              <Word.Skeleton />
              <Word.Skeleton />
              <Word.Skeleton />
            </>
          )}
        </AnimatePresence>
        < div style={{ height: 64 }} />
      </div>
    </>
  )
}

interface WordProps extends Controllable<boolean> {
  word: WordType
}

function Word(props: WordProps) {
  const {
    word,
    onValueChange,
    value,
  } = props

  const [speaking, setSpeaking] = useState(false)
  const { pitch, rate, voice, volume } = useTTSSettingsStore()

  const handleClick: React.MouseEventHandler = () => {
    tts.speak(word.kr, {
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
      <Toggle value={value} onValueChange={onValueChange}><Check /></Toggle>
    </div>
  )
}

Word.Skeleton = function Skeleton() {
  return (
    <div data-skeleton>
      <div data-label>
        <div data-kr />
        <div data-en />
      </div>
      <Spacer.Flex flex="1" />
      <div data-toggle />
    </div>
  )
}

Words.getLayout = DashboardLayout;

export default Words;