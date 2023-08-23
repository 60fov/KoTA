import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { type ThemeOption } from './theme'
import Word, { type WordTable, type WordType } from './words'


interface ThemeStore {
  value: ThemeOption
  set: (value: ThemeOption) => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      value: 'system',
      set: (value: ThemeOption) => set(() => ({ value }))
    }),
    {
      name: 'theme',
    }
  )
)

export interface AudioSettingsStore {
  enabled: boolean
  volume: number
  getLevel: () => string
  setEnabled: (enabled: boolean) => void
  setVolume: (volume: number) => void
}

export const useAudioSettingsStore = create<AudioSettingsStore>()(
  persist(
    (set, get) => ({
      enabled: true,
      volume: 1,
      getLevel: () => {
        const {volume, enabled} = get()
        if (volume === 0 || !enabled) return "mute"
        if (volume < 0.34) return "quiet"
        if (volume < 0.67) return "moderate"
        return "loud"
      },
      setEnabled: (enabled) => set(() => ({ enabled })),
      setVolume: (volume) => set(() => ({ volume })),
    }),
    { name: 'audio' }
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
      voice: undefined,
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

export interface WordTableStore {
  wordTable: WordTable
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
      wordTable: Word.list.reduce((accum, word) => {
        const key = Word.key(word)
        accum[key] = {
          ...word,
          enabled: true,
          key
        }
        return accum
      }, {} as WordTable),
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