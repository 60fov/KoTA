import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { type Theme } from './theme'
import Word, { type WordType } from './words'
import { TTSLang } from './tts'


interface ThemeStore {
  value: Theme
  set: (value: Theme) => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      value: 'system',
      set: (value: Theme) => set(() => ({ value }))
    }),
    {
      name: 'theme',
    }
  )
)

interface TTSSettingsStore {
  enabled: boolean
  volume: number // 0-1
  pitch: number // 0-2
  rate: number // 0.1-10
  voice?: SpeechSynthesisVoice
  enable: () => void
  disable: () => void
  setEnabled: (enabled: boolean) => void
  setVolume: (volume: number) => void
  setPitch: (pitch: number) => void
  setRate: (rate: number) => void
  setVoice: (voice: SpeechSynthesisVoice) => void
}

export const useTTSSettingsStore = create<TTSSettingsStore>()(
  persist(
    (set) => ({
      enabled: false,
      volume: 0.6,
      pitch: 1,
      rate: 0.7,
      enable: () => set(() => ({ enabled: true })),
      disable: () => set(() => ({ enabled: false })),
      setEnabled: (enabled) => set(() => ({ enabled })),
      setVolume: (volume) => set(() => ({ volume })),
      setPitch: (pitch) => set(() => ({ pitch })),
      setRate: (rate) => set(() => ({ rate })),
      setVoice: (voice) => set(() => ({ voice }))
    }),
    { name: 'tts' }
  )
)

interface KeyboardSettingsStore {
  enabled: boolean
  enable: () => void
  disable: () => void
  setEnabled: (enabled: boolean) => void
}

export const useKeyboardSettingsStore = create<KeyboardSettingsStore>()(
  persist(
    (set) => ({
      enabled: false,
      enable: () => set(() => ({ enabled: true })),
      disable: () => set(() => ({ enabled: false })),
      setEnabled: (enabled) => set(() => ({ enabled })),
    }),
    { name: 'keyboard' }
  )
)


interface WordTableStore {
  wordTable: Record<string, WordType>
  // setWordMap: (words: Word[]) => void
  setWord: (key: string, word: WordType) => void
  toggleWord: (key: string) => void
  enableWord: (key: string) => void
  disableWord: (key: string) => void
  addWord: (word: WordType) => void
  removeWord: (word: WordType) => void
  addWords: (...word: WordType[]) => void
  removeWords: (...word: WordType[]) => void
}

export const useWordTableStore = create<WordTableStore>()(
  persist(
    (set) => ({
      wordTable: {},
      setWord: (key: string, word: WordType) => set(({ wordTable }) => {
        wordTable[key] = word
        return {
          ...wordTable,
          [key]: word
        }
      }),
      toggleWord: (key: string) => set(({ wordTable }) => {
        const word = wordTable[key]
        if (!word) throw new Error("word not in table")
        word.enabled = !word.enabled
        return {
          ...wordTable,
          [key]: word
        }
      }),
      enableWord: (key: string) => set(({ wordTable }) => {
        const word = wordTable[key]
        if (!word) throw new Error("word not in table")
        word.enabled = true
        return {
          ...wordTable,
          [key]: word
        }
      }),
      disableWord: (key: string) => set(({ wordTable }) => {
        const word = wordTable[key]
        if (!word) throw new Error("word not in table")
        word.enabled = false
        return {
          ...wordTable,
          [key]: word
        }
      }),
      addWord: (word: WordType) => set(({ wordTable }) => {
        const key = Word.key(word)
        if (wordTable[key]) throw new Error("Word Error: word already in table, fn: addWord()")
        return {
          ...wordTable,
          [key]: word
        }
      }),
      removeWord: (word: WordType) => set(({ wordTable }) => {
        const key = Word.key(word)
        delete wordTable[key]
        return wordTable
      }),
      addWords: (...words: WordType[]) => set(({ wordTable }) => {
        words.forEach(word => {
          const key = Word.key(word)
          if (wordTable[key]) throw new Error("Word Error: word already in table, fn: addWord()")
          wordTable[key] = word
        })
        return wordTable
      }),
      removeWords: (...words: WordType[]) => set(({ wordTable }) => {
        words.forEach(word => {
          const key = Word.key(word)
          if (wordTable[key]) throw new Error("Word Error: word already in table, fn: addWord()")
          delete wordTable[key]
        })
        return wordTable
      }),
    }),
    {
      name: 'wordlist',
      skipHydration: true
    }
  )
)