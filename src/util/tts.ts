/* TODO: TTS (even need to be a hook?)
play
pause
queue
cancel
settings
optimize
lang defaults to language of text

rapid playback blocks
*/

const synth = window.speechSynthesis

export type SpeakOptions = {
    lang?: 'ko-KR' | 'en-US' | undefined
    pitch?: number
    rate?: number
    force?: boolean
}

const speak = (text: string, options?: SpeakOptions) => {
    const utterance = new SpeechSynthesisUtterance()
    if (options) {
        if (options.lang) utterance.lang = options.lang
        if (options.pitch) utterance.pitch = options.pitch
        if (options.rate) utterance.rate = options.rate
        if (options.force && (synth.speaking || synth.pending)) synth.cancel()
    }
    utterance.text = text
    synth.speak(utterance)
}

export default { speak, synth }