import { AnimatePresence, animate, motion, useMotionValue } from "framer-motion"
import useKime from "lib/hooks/useKime"
import { decompose } from "lib/kime/jamo"
import { forwardRef, useImperativeHandle, useRef, useState } from "react"
import { useUserMetricAnalytics } from "~/utils/analytics"
import { cn } from "~/utils/fns"
import { type WordType } from "~/utils/words"

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