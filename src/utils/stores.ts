import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { type Theme } from './theme'


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