import Slider from "./ui/Slider";
import React, { type RefObject, useEffect, useReducer, useRef } from "react";
import { nanoid } from "nanoid";
import { createCtx, random } from "~/utils/fns";

import useKime from "lib/hooks/useKime";
import { useEventListener } from "usehooks-ts";

import styles from "./EndlessSlider.module.scss"
import { decompose } from "lib/kime/jamo";
import useSound from "~/hooks/useSound";

import keySfxPath from "@/audio/key.mp3";
import deleteSfxPath from "@/audio/delete.mp3";
import successSfxPath from "@/audio/success.mp3";
import { Dict, type TWord } from "~/utils/dictionary";
import drawLine from "~/utils/line";

/*
TODO
user metrics
user metic baased dynamic words
user objectives
achievements
*/

type TSliderWord = TWord & {
  id: string
}

type SliderAction =
  | { type: "next" }
  | { type: "prev" }
  | { type: "close" }
  | { type: "open" }
  | { type: "goto", index: number }
  | { type: "itemLeaveView", el: HTMLElement }

type SliderState = {
  open: boolean
  index: number
  list: TSliderWord[]
}

interface EndlessModeContextInterface {
  refInput: RefObject<HTMLInputElement>
  state: SliderState
  dispatch: React.Dispatch<SliderAction>
}

const [useEndlessModeContext, EndlessModeContextProvider] = createCtx<EndlessModeContextInterface>()

function createInitialState(pool: TSliderWord[]): SliderState {
  return {
    open: true,
    index: 0,
    list: random.shuffle(pool).slice(0, 20).map(item => ({ ...item, id: nanoid() })),
  }
}

function reducer(state: SliderState, action: SliderAction): SliderState {
  switch (action.type) {
    case "prev": {
      const newIndex = state.index > 0 ? state.index - 1 : state.index
      return {
        ...state,
        index: newIndex
      }
    }
    case "next": {
      const newIndex = state.index < state.list.length - 1 ? state.index + 1 : state.index
      return {
        ...state,
        index: newIndex
      }
    }
    case "open": {
      return {
        ...state,
        open: true
      }
    }
    case "close": {
      return {
        ...state,
        open: false
      }
    }
    case "itemLeaveView": {
      // if (!state.open) return state

      const indexAttrib = action.el.getAttribute('data-index')
      if (indexAttrib == null) return state
      const i = parseInt(indexAttrib)
      if (i >= state.index) return state

      const newWord = { ...Dict.getRandomWord(), id: nanoid() }

      return {
        ...reducer(state, { type: "prev" }),
        list: [...state.list.slice(1), newWord]
      }
    }
    case "goto": {
      if (action.index < 0 || action.index >= state.list.length) return state
      return {
        ...state,
        index: action.index
      }
    }
  }
}

export default function EndlessMode(props: {
  pool: TSliderWord[]
  children: React.ReactNode
}) {
  const { children } = props

  const [state, dispatch] = useReducer(reducer, props.pool, createInitialState)

  const refInput = useRef<HTMLInputElement>(null)

  const currentItem = state.list[state.index]
  if (!currentItem) throw new Error("slider index out of bounds")

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [])

  useEffect(() => {
    refInput.current?.focus()
  }, [])

  const onKeyDown = (e: KeyboardEvent) => {
    if (document.activeElement === document.body) {
      refInput.current?.focus()
    }

    if (e.metaKey || e.ctrlKey) {
      if (e.key === "Enter") {
        if (e.shiftKey) dispatch({ type: "prev" })
        else dispatch({ type: "next" })
      }
    }
  }

  const onClick = () => {
    refInput.current?.focus()
  }

  return (
    <div className={styles.base} onClick={onClick}>
      <EndlessModeContextProvider value={{ refInput, state, dispatch }}>
        {children}
      </EndlessModeContextProvider>
    </div>
  )
}


function EndlessSlider() {
  const { state, dispatch } = useEndlessModeContext()

  const onSliderItemViewLeave = (el: HTMLDivElement | null) => {
    if (el === null) return
    dispatch({ type: "itemLeaveView", el })
  }

  const onClick = (e: React.MouseEvent) => {
    const indexStr = e.currentTarget.getAttribute("data-index")
    if (!indexStr) return
    const index = parseInt(indexStr)
    if (isNaN(index)) return

    const clickedOnCurrentWord = index === state.index
    if (clickedOnCurrentWord) {
      // open a menu with options (variants, use examples, tts)
      // select and open context menu on right-click?
    } else {
      dispatch({ type: "goto", index })
    }
  }

  return (
    <Slider.Base index={state.index} open={true}>
      {
        state.list.map((word, i) => (
          <Slider.Item
            onViewLeave={onSliderItemViewLeave}
            id={word.id}
            key={word.id}
            data-id={word.id}
            data-index={i}
            onClick={onClick}
            className="select-none cursor-pointer"
          >
            {word.kr}
          </Slider.Item>
        ))
      }
    </Slider.Base>
  )
}

function Translation() {
  const { state } = useEndlessModeContext()
  const word = state.list[state.index]

  if (!word) {
    console.error("endless mode translation word not defined")
    return null;
  }

  return (
    <p data-en>
      {word.en}
    </p>
  )
}

function EndlessInput() {
  const { refInput, state, dispatch } = useEndlessModeContext()

  const kinput = useKime(refInput)

  const currentWord = state.list[state.index]

  const keySfx = useSound(keySfxPath)
  const deleteSfx = useSound(deleteSfxPath)
  const successSfx = useSound(successSfxPath)

  useEventListener('keydown', (event) => {
    if (document.activeElement === refInput.current) {
      if (event.key.length === 1 && event.key !== ' ') void keySfx.play({ force: true })
      else if (event.key === 'Backspace') void deleteSfx.play({ force: true })
    }
  })

  useEventListener('keydown', event => {
    if (!currentWord) return
    if (event.code === 'Space' || event.code === 'Enter') {
      if (kinput.value === currentWord.kr) {
        dispatch({ type: "next" })
        kinput.clear()
        void successSfx.play({ force: true })
      }
    }
  })


  const renderText = () => {
    if (!currentWord) return
    const chars = kinput.value.split("")

    const Char = {
      Space: () => <span style={{ color: "var(--color-front-alt-100)" }}>•</span>,
      Error: (props: { char: string }) => <span style={{ color: "var(--color-error-100)" }}>{props.char}</span>,
      Composing: (props: { char: string }) => <span style={{ borderBottom: "solid 1px var(--color-front-100)" }}>{props.char}</span>,
      Default: (props: { char: string }) => <span>{props.char}</span>,
    }

    return (
      chars.map((c, i) => {
        const key = `${c}-${i}`
        if (c === ' ') return <Char.Space key={key} />

        const inputLongerThanGoal = i >= currentWord.kr.length
        if (inputLongerThanGoal) return <Char.Error key={key} char={c} />

        const isOnLastChar = i === kinput.value.length - 1
        if (isOnLastChar && kinput.isComposing) {
          // deep compare
          const currentJamo = currentWord.kr[i]
          if (!currentJamo) throw Error("∂∂∂")
          const decomGoal = decompose(currentJamo)
          const decomChar = decompose(c)

          const error = decomChar.some((dc, j) => {
            if (j >= decomGoal.length) {
              const nextJamo = currentWord.kr[i + 1]
              if (!nextJamo) return true // there is no next char
              return dc !== decompose(nextJamo)[0] // too lazy  to explain
            }

            const dg = decomGoal[j]
            if (dc !== dg) {
              return true
            }
          })

          if (error) return <Char.Error key={key} char={c} />

          return <Char.Default key={key} char={c} />
        }

        const inputMatchesGoal = c === currentWord.kr[i]
        if (!inputMatchesGoal) return <Char.Error key={key} char={c} />

        return <Char.Default key={key} char={c} />
      })
    )
  }

  return (
    <div style={{
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      height: 36,
      gap: 'var(--spacing-md)',
      justifyContent: "center",
      padding: 'var(--spacing-sm) var(--spacing-md)',
      boxSizing: 'content-box',
    }}>
      <input ref={refInput} type="text" style={{
        width: "1px",
        height: "1px",
        clip: "rect(0 0 0 0)",
        clipPath: "inset(50%)",
        overflow: "hidden",
        position: "absolute",
        whiteSpace: "nowrap",
      }} />
      <span style={{
        color: 'var(--color-front-100)',
        fontSize: 36,
        fontWeight: 600
      }}>{renderText()}</span>
      <div style={{
        transition: "all 150ms ease-in-out",
        position: 'absolute',
        left: '100%',
        transform: 'translateX(-100%)',
        height: kinput.hasFocus ? "100%" : 0,
        width: 4,
        background: 'var(--color-front-100)',
        animation: 'cursor 1s infinite alternate'
      }} />
    </div>
  )
}


EndlessMode.Slider = EndlessSlider
EndlessMode.Translation = Translation
EndlessMode.Input = EndlessInput