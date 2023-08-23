import { useEffect, useRef } from "react"
import { createCtx } from "~/utils/fns"
import { useAudioSettingsStore, type AudioSettingsStore } from "~/utils/stores"

type AudioContextInterface = AudioSettingsStore;

export const [AudioContext, AudioContextProvider] = createCtx<AudioContextInterface>()

export default function useSound(path: string) {
  const refAudio = useRef<HTMLAudioElement>()

  const settings = useAudioSettingsStore()

  useEffect(() => {
    refAudio.current = new Audio(path)
  }, [path])

  useEffect(() => {
    if (!refAudio.current) return
    refAudio.current.volume = settings.volume
  }, [settings])

  return {
    async play(options?: { force?: boolean }) {
      if (!settings.enabled) return
      const {
        force
      } = options || {}

      if (!refAudio.current) return
      if (force) {
        refAudio.current.pause()
        refAudio.current.currentTime = 0
      }
      await refAudio.current.play()
    },
    audio: refAudio.current
  }
}