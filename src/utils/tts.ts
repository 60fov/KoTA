export type TTSLang = "en" | "ko"

export interface SpeakOptions {
  force?: boolean
  pitch?: number
  rate?: number
  volume?: number
  lang?: TTSLang
  voice?: SpeechSynthesisVoice
  onstart?: (e: Event) => void
  onerror?: (e: Event) => void
  onend?: (e: Event) => void
  onmark?: (e: Event) => void
  onpause?: (e: Event) => void
  onboundary?: (e: Event) => void
}

export function speak(text: string, options?: SpeakOptions) {
  const {
    force,
    pitch = 1,
    rate = 1,
    volume = 0.5,
    lang,
    voice,
  } = options || {}
  const utterance = new SpeechSynthesisUtterance(text)

  utterance.pitch = pitch
  utterance.rate = rate
  utterance.volume = volume
  if (lang) utterance.lang = lang
  utterance.voice = voice ?? null
  // NOTE: potential memory leak
  if (options?.onstart) utterance.addEventListener('start', options.onstart)
  if (options?.onerror) utterance.addEventListener('error', options.onerror)
  if (options?.onend) utterance.addEventListener('end', options.onend)
  if (options?.onmark) utterance.addEventListener('mark', options.onmark)
  if (options?.onpause) utterance.addEventListener('pause', options.onpause)
  if (options?.onboundary) utterance.addEventListener('boundary', options.onboundary)

  if (force) window.speechSynthesis.cancel()
  window.speechSynthesis.speak(utterance)
}

const tts = {
  speak
}

export default tts