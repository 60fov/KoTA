import { useTTSSettingsStore } from "../stores";
import tts, { type SpeakOptions } from "../tts";

export default function useTTS(options?: SpeakOptions) {
  const settings = useTTSSettingsStore(({
    pitch,
    rate,
    volume,
    enabled,
    voice,
  }) => ({
    pitch,
    rate,
    volume,
    enabled,
    voice,
  }))

  const opts = { ...settings, ...options }

  const speak = (text: string) => {
    if (settings.enabled) tts.speak(text, opts)
  }

  return speak
}