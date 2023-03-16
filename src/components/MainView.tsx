import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import Slider from "~/components/ui/Slider";
import { WordList } from "~/utils/words";
import useKime from "~/lib/hooks/useKime";
import { animate, AnimatePresence, motion, useMotionValue } from "framer-motion";
import { cn, createCtx, random } from "~/utils/fns";
import { decompose } from "~/lib/kime/jamo";
import { Analytics } from "~/utils/analytics";


// TODO move this to another file (maybe)
// TODO keyboard display
// TODO TTS


interface AnalyticsContextInterface {
  markWordStart: () => void
  resetWordTimer: () => void
  isWordTimerRunning: () => boolean
}

const [useAnalyticsContext, AnalyticsProvider] = createCtx<AnalyticsContextInterface>()

export default function MainView() {
  const inputRef = useRef<InputFieldHandle>(null)
  const wordStartTime = useRef<number>(0)

  const [wordList, setWordList] = useState<Word[]>()
  const [index, setIndex] = useState(0)

  const currentWord = wordList?.[index]

  const analyticsContextValue: AnalyticsContextInterface = {
    markWordStart() {
      wordStartTime.current = Date.now()
      console.log("word timer start: ", wordStartTime.current)
    },
    resetWordTimer() {
      wordStartTime.current = 0
      console.log("word timer reset ", wordStartTime.current)
    },
    isWordTimerRunning() {
      return wordStartTime.current === 0
    }
  }

  useEffect(() => {
    setWordList(listOf(randomWord, 20))
    inputRef.current?.focus()
  }, [])

  function listOf<T>(fn: () => T, length: number): T[] {
    const result: T[] = []
    for (let i = 0; i < length; i++) {
      result.push(fn())
    }
    return result
  }


  function nextWord() {
    if (!wordList) return

    setIndex(index + 1)
    setWordList([...wordList, randomWord()])
    inputRef.current?.clear()
  }

  function handleMatch() {
    if (!currentWord) return

    const elapsed = Date.now() - wordStartTime.current
    wordStartTime.current = 0
    Analytics.submitRecord(currentWord.id, currentWord.kr, elapsed)
    Analytics.flush()

    nextWord()
  }

  function handleViewLeave() {
    if (!wordList) return
    setWordList(wordList.slice(1))
    setIndex(index - 1)
  }

  const handleClick: React.MouseEventHandler = () => {
    console.log("click")
    inputRef.current?.focus()
  }

  const handleKeyDown: React.KeyboardEventHandler = (e) => {
    if (e.code === "Enter" && e.ctrlKey) handleMatch()
  }

  return (
    <AnalyticsProvider value={analyticsContextValue}>
      <div
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className="flex flex-col gap-8 items-center">
        <span className="text-front-alt font-medium italic ">{currentWord?.en}</span>
        <Slider.Base index={index}>
          {
            wordList && wordList.map((word) => (
              <Slider.Item onViewLeave={handleViewLeave} id={word.id} key={word.id}>{word.kr}</Slider.Item>
            ))
          }
        </Slider.Base>
        <InputField ref={inputRef} goal={currentWord} onMatch={handleMatch} />
      </div>
    </AnalyticsProvider>
  )
}

interface InputFieldProps {
  goal?: Word,
  spaceChar?: string
  onMatch: () => void
  matchOnSpace?: boolean
  matchOnEnter?: boolean
}

interface InputFieldHandle {
  clear: () => void
  focus: () => void
  blur: () => void
}

/*
INPUT FIELD
TODO
  error display
*/

const InputField = forwardRef<InputFieldHandle, InputFieldProps>(function InputField(props: InputFieldProps, ref) {
  const {
    goal,
    spaceChar = "•",
    onMatch,
    matchOnSpace = true,
    matchOnEnter = true
  } = props

  const inputRef = useRef<HTMLInputElement>(null)
  const [focused, setFocused] = useState(false)

  const { isWordTimerRunning, markWordStart } = useAnalyticsContext()

  const { input, composing } = useKime(inputRef)

  const caretOpacityMotionValue = useMotionValue(1)
  void animate(caretOpacityMotionValue, [1, 0.05], {
    repeat: Infinity,
    repeatType: "mirror",
    duration: 1
  })


  useImperativeHandle(ref, () => {
    return {
      clear() {
        input.clear()
      },
      focus() {
        inputRef.current?.focus()
      },
      blur() {
        inputRef.current?.blur()
      }
    }
  })

  const handleKeyDown: React.KeyboardEventHandler = (e) => {
    if (isWordTimerRunning() && input.value === "") {
      markWordStart()
    }

    if (matchOnSpace && e.code === "Space") {
      if (goal?.kr === input.value) onMatch()
    }

    if (matchOnEnter && e.code === "Enter") {
      if (goal?.kr === input.value) onMatch()
    }
  }

  // TODO
  // performance check (consider debounce)
  // add lookahead for more accurate errors
  function parseInput(input: string, goal: string) {
    return Array.from(input).map((jamo, i) => {
      if (jamo === " ") {
        return <span key={i} className="opacity-25">{spaceChar}</span>
      }

      if (i >= goal.length) {
        return <span key={i} className="text-error">{jamo}</span>
      }

      const isLastJamo = i === input.length - 1
      const gj = goal[i] ?? ""
      const isMatch = (isLastJamo && composing) ?
        samePrefix(decompose(gj), decompose(jamo)) :
        gj === jamo

      return isMatch
        ? <span key={i}>{jamo}</span>
        : <span key={i} className="text-error">{jamo}</span>
    })
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={cn(
          "[clip:rect(0,0,0,0)] absolute",
        )} />
      <p className={cn("text-4xl font-semibold text-front h-12 px-1")}>
        {
          parseInput(input.value, goal?.kr ?? "")
        }

        <AnimatePresence initial={false}>
          {
            focused &&
            <motion.span
              key={"caret"}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              exit={{ scaleY: 0 }}
              style={{ opacity: caretOpacityMotionValue }}
              layout="position"
              transition={{
                type: "spring",
                damping: 10,
                mass: 0.5,
                stiffness: 190
              }}
              className={cn(
                "absolute left-full top-0 bottom-0 w-1 bg-front",
              )} />
          }
        </AnimatePresence>
      </p>
    </div>
  )
})


// HELPER FUNCTIONS

function samePrefix(a: string[], b: string[]) {
  let i = 0;

  while (i < a.length && i < b.length && a[i] === b[i]) {
    i++;
  }

  return i === a.length || i === b.length;
}

type Word = ReturnType<typeof randomWord>

function randomWord() {
  return {
    ...random.fromArray(WordList, { kr: "??", roman: "??", en: "??", }),
    id: random.nano()
  }
}