import create from 'zustand'
import { persist } from 'zustand/middleware'

import { Theme } from './theme'

const ModeList = ["jamo", "word", "multi-word"] as const
export type Mode = typeof ModeList[number]

export const isMode = (mode: string): mode is Mode => ModeList.includes(mode as Mode)

interface ModeState {
    mode: "jamo" | "word" | "multi-word" | "test"
    setMode: (newMode: Mode) => void
}

export const useModeStore = create<ModeState>()(
    persist(
        (set) => ({
            mode: "test",
            setMode: (newMode) => set(() => ({ mode: newMode }))
        }),
        { name: 'typing-mode' }
    )
)

interface DisplaySettingsStore {
    showRomanization: boolean
    showTranslation: boolean
    showSpaces: boolean
    showDecomposed: boolean
    setShowRomanization: (show: boolean) => void
    setShowTranslation: (show: boolean) => void
    setShowSpaces: (show: boolean) => void
    setShowDecomposed: (show: boolean) => void
}

// TODO: seperate via mode
export const useDisplaySettingsStore = create<DisplaySettingsStore>()((set) => ({
    showRomanization: false,
    showTranslation: true,
    showSpaces: true,
    showDecomposed: true,
    setShowRomanization: (showRomanization) => set(() => ({ showRomanization })),
    setShowTranslation: (showTranslation) => set(() => ({ showTranslation })),
    setShowSpaces: (showSpaces) => set(() => ({ showSpaces })),
    setShowDecomposed: (showDecomposed) => set(() => ({ showDecomposed })),
}))

interface TTSSettingsStore {
    enabled: boolean
    volume: number // 0-1
    pitch: number // 0-2
    rate: number // 0.1-10
    // voice: string
    enable: () => void
    disable: () => void
    setEnabled: (enabled: boolean) => void
    setVolume: (volume: number) => void
    setPitch: (pitch: number) => void
    setRate: (rate: number) => void
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
        }),
        { name: 'tts' }
    )
)

interface KeyboardSettingsStore {
    visible: boolean
    setVisible: (visible: boolean) => void
}

export const useKeyboardSettingsStore = create<KeyboardSettingsStore>()(
    persist(
        (set) => ({
            visible: true,
            setVisible: (visible) => set(() => ({ visible }))
        }),
        { name: 'keyboard' }
    )
)

interface ThemeStore {
    theme: Theme
    setTheme: (theme: Theme) => void
}

export const useThemeStore = create<ThemeStore>()(
    persist(
        (set) => ({
            theme: 'system',
            setTheme: (theme: Theme) => set(() => ({ theme }))
        }), 
        { name: 'theme' }
    )
)

