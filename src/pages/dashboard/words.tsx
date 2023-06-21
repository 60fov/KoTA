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
import Spacer from "~/components/ui/Spacer";


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

    console.log(filteredWords)

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

  return (
    <div className={styles.word}>
      <div data-word-label>
        <span data-kr>{word.kr}</span>
        <span data-en>{word.en}</span>
      </div>
      <Spacer.Flex flex="1" />
      <Toggle><Check /></Toggle>
    </div>
  )
}

Words.getLayout = DashboardLayout;

export default Words;