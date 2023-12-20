import { Dict, TWord } from "~/utils/dictionary";
import styles from "./Dictionary.module.scss";
import Input from "./ui/Input";
import { useRef, useState } from "react";
import { decompose } from "lib/kime/jamo";

import fuzzysort from "fuzzysort";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { useOnClickOutside } from "usehooks-ts";

// TODO
/*
dictionary
- fix layout
- add to ui flow
- style scrollbar
- framer integration

search
- check scalability (how many words till meaningful perf loss)
- encapsulate functionality
- update input component
*/

function Dictionary() {
    const [search, setSearch] = useState("")

    const krWords = Dict.defaultWords.map(word => ({
        ...word,
        dkr: decompose(word.kr).join("")
    }));

    const krSearchResult = fuzzysort.go(
        decompose(search).join(""),
        krWords,
        { key: "dkr" }
    );
    const enSearchResult = fuzzysort.go(
        search,
        Dict.defaultWords,
        { key: "en" }
    );

    const searchResult = enSearchResult
        .concat(krSearchResult)
        .sort((a, b) => a.score + b.score);

    const filteredWords = search ?
        searchResult.map((result) => result.obj) :
        Dict.defaultWords;

    return (
        <div className={styles.base}>
            {/* tag filter system */}

            {/* edit ui */}

            {/* list */}
            <div className="overflow-hidden">
                <ul data-word-list>
                    {filteredWords.length > 0 ?
                        filteredWords.map((word) => {
                            return (
                                <li key={word.kr.concat(word.en)}>
                                    <Entry word={word}></Entry>
                                </li>
                            )
                        }) : (
                            <div className="p-2 rounded-md bg-[var(--color-back-100)] [border:var(--border)]">
                                no word found
                            </div>
                        )}
                </ul>
            </div>

            {/* searchbar */}
            <Input
                prefix={<HiMagnifyingGlass />}
                onValueChange={(value) => { setSearch(value) }}
            />
        </div>
    )
}

function Entry(props: { word: TWord }) {
    return (
        <div className={styles.entry}>
            <div data-title>
                <span data-title-kr >
                    {props.word.kr}
                </span>
                <span data-title-rm>
                    {props.word.rm}
                </span>
            </div>
            <ul data-translation-list>
                <li>
                    <div data-translation-entry>
                        <span data-translation>
                            {props.word.en}
                        </span>
                        <span data-pos>
                            {props.word.speech}
                        </span>
                    </div>
                </li>
            </ul>
            {/* <div>
                {props.word.tags}
            </div> */}
        </div>
    )
}


export default Dictionary;