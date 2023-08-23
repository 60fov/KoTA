import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import Slider from "~/components/ui/Slider";
import useKime from "lib/hooks/useKime";
import { animate, AnimatePresence, motion, useMotionValue } from "framer-motion";
import { cn, random } from "~/utils/fns";
import { decompose } from "lib/kime/jamo";
import { useUserMetricAnalytics } from "~/utils/analytics";
import { useWordTableStore } from "~/utils/stores";
import { type WordType } from "~/utils/words";
import useTTS from "~/hooks/useTTS";

export default function MainView() {
  const inputRef = useRef<InputFieldHandle>(null)
  const refSfx1 = useRef<HTMLAudioElement>(null)

  const { wordTable } = useWordTableStore((state) => state)
  const [wordList, setWordList] = useState<WordType[]>()
  const [index, setIndex] = useState(0)

  const speak = useTTS({ force: true, lang: 'ko' })

  const [viewOpen, setViewOpen] = useState(false)

  const currentWord = wordList?.[index]

  const enabledWords = useMemo(() => {
    return Object
      .values(wordTable)
      .filter((word) => word.enabled)
  }, [wordTable])


  useEffect(() => {
    // inputRef.current?.focus()

    const kh = () => {
      if (document.activeElement === document.body) inputRef.current?.focus()
    }

    window.addEventListener("keydown", kh)

    return () => {
      window.removeEventListener("keydown", kh)
    }
  }, [])

  useEffect(() => {
    const initialWords = random.shuffle(enabledWords.slice(0, 20))
    setWordList(initialWords)
  }, [enabledWords])

  useEffect(() => {
    if (currentWord) speak(currentWord.kr)
  }, [currentWord, speak])

  function nextWord() {
    if (!wordList) return

    setIndex(index + 1)
    setWordList([...wordList, random.fromArrayOrDefault(enabledWords, {} as WordType)])
    inputRef.current?.clear()
  }

  function handleMatch() {
    if (!currentWord) return
    nextWord()
  }

  function handleViewLeave(el: HTMLDivElement | null) {
    if (!wordList || !el || !viewOpen) return
    // check if word el is on left side
    const indexAttrib = el.getAttribute('data-index')
    if (indexAttrib == null) return
    const i = parseInt(indexAttrib)
    if (i < index) {
      setWordList(wordList.slice(1))
      setIndex(index - 1)
    }
  }

  const handleClick: React.MouseEventHandler = () => {
    inputRef.current?.focus()
    setViewOpen(true)
  }

  const handleKeyDown: React.KeyboardEventHandler = (e) => {
    if (refSfx1.current) {
      refSfx1.current.pause()
      refSfx1.current.currentTime = 0
      void refSfx1.current?.play()
    }
    if (e.code === "Enter" && (e.ctrlKey || e.metaKey)) {
      if (e.shiftKey) {
        if (index > 0) setIndex(index - 1)
      } else {
        handleMatch()
      }

    }
  }

  const handleFocus: React.FocusEventHandler = () => {
    setViewOpen(true)
    if (currentWord) speak(currentWord.kr)
  }

  const handleBlur: React.FocusEventHandler = () => {
    setViewOpen(false)
  }

  return (
    <div
      tabIndex={1}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className="flex flex-col gap-8 items-center justify-center relative">
      <span className="text-front-alt text-xl font-medium italic">{currentWord?.en}</span>
      <Slider.Base index={index} open={viewOpen}>
        {
          wordList && wordList.map((word, i) => (
            <Slider.Item
              onViewLeave={handleViewLeave}
              id={word.key + String(i)}
              key={word.key + String(i)}
              data-id={word.key + String(i)}
              data-index={i}
            >
              {word.kr}
            </Slider.Item>
          ))
        }
      </Slider.Base>
      <InputField ref={inputRef} goal={currentWord} onMatch={handleMatch} />
      <audio src="/Tab 1.m4a" ref={refSfx1} />
      {/* {!viewOpen && <span className="absolute bottom-0 text-2xl text-front-alt/50 font-semibold pointer-events-none">type or tap to focus</span>} */}
    </div>
  )
}

interface InputFieldProps {
  goal?: WordType,
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


// INPUT FIELD

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

  const { input, composing } = useKime(inputRef)
  const metrics = useUserMetricAnalytics(input.value, goal?.kr || "", {})

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
    const submitMatch =
      matchOnSpace && e.code === "Space" ||
      matchOnEnter && e.code === "Enter"
    const matches = goal?.kr === input.value
    if (submitMatch && matches) {
      onMatch()
      metrics.submit()
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