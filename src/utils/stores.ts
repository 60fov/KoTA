import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { type ThemeOption } from './theme'
import Dictionary, { Dict } from './dictionary'


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
        const { volume, enabled } = get()
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
      enabled: true,
      enable: () => set(() => ({ enabled: true })),
      disable: () => set(() => ({ enabled: false })),
      setEnabled: (enabled) => set(() => ({ enabled })),
    }),
    { name: 'keyboard' }
  )
)

export interface DictionaryStore {
  dictionaryTable: Record<string, Dictionary>
  add: (name: string, dict: Dictionary) => void
  remove: (name: string) => void
  // enable: (name: string) => void
  // disable: (name: string) => void
  // write: (name: string ,dict: Dictionary) 
}

export const useDictionaryStore = create<DictionaryStore>()(
  persist(
    (set) => ({
      dictionaryTable: { defaultDictionary: new Dictionary(Dict.defaultWords) },
      add: (name, dict) => set((state) => ({ dictionaryTable: { ...state.dictionaryTable, [name]: dict } })),
      remove: (name) => set((state) => {
        delete state.dictionaryTable[name]
        return state
      }),
    }),
    {
      name: 'dicitionary',
      skipHydration: true
    }
  )
)