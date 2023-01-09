import create from 'zustand'
import { Theme } from './theme';

const ModeList = ["jamo", "word", "multi-word"] as const
export type Mode = typeof ModeList[number];

export const isMode = (mode: string): mode is Mode => ModeList.includes(mode as Mode)

interface ModeState {
    mode: "jamo" | "word" | "multi-word"
    setMode: (newMode: Mode) => void
}

export const useModeStore = create<ModeState>((set) => ({
    mode: "multi-word",
    setMode: (newMode) => set(() => ({ mode: newMode }))
}))

interface DisplaySettingsStore {
    showRomanization: boolean
    showTranslation: boolean
    showSpaces: boolean
    setShowRomanization: (show: boolean) => void
    setShowTranslation: (show: boolean) => void
    setShowSpaces: (show: boolean) => void
}

// TODO: seperate via mode
export const useDisplaySettingsStore = create<DisplaySettingsStore>((set) => ({
    showRomanization: false,
    showTranslation: true,
    showSpaces: true,
    setShowRomanization: (showRomanization) => set(() => ({ showRomanization })),
    setShowTranslation: (showTranslation) => set(() => ({ showTranslation })),
    setShowSpaces: (showTranslation) => set(() => ({ showTranslation }))
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

export const useTTSSettingsStore = create<TTSSettingsStore>((set) => ({
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
}))

interface KeyboardSettingsStore {
    visible: boolean
    setVisible: (visible: boolean) => void
}

export const useKeyboardSettingsStore = create<KeyboardSettingsStore>((set) => ({
    visible: true,
    setVisible: (visible) => set(() => ({ visible }))
}))

interface ThemeStore {
    theme: Theme
    setTheme: (theme: Theme) => void
}

export const useThemeStore = create<ThemeStore>((set) => ({
    theme: 'system',
    setTheme: (theme: Theme) => set(() => ({ theme }))
}))

