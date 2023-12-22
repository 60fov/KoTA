export type TTSLang = "en-US" | "ko-KR";

export interface SpeakOptions {
  force?: boolean;
  pitch?: number;
  rate?: number;
  volume?: number;
  lang?: TTSLang;
  voiceId?: VoiceId;
  onstart?: (e: SpeechSynthesisEvent) => void;
  onerror?: (e: SpeechSynthesisErrorEvent) => void;
  onend?: (e: SpeechSynthesisEvent) => void;
  onmark?: (e: SpeechSynthesisEvent) => void;
  onpause?: (e: SpeechSynthesisEvent) => void;
  onboundary?: (e: SpeechSynthesisEvent) => void;
}

// TODO 
// lang to voice maps
// load voices from local storage
// auto defaults
// warnings when missing a lang

// end queue
// custom tts

export type VoiceId = string;

let voiceMap: Map<VoiceId, SpeechSynthesisVoice>;

function initVoiceMap() {
  if (typeof window === "undefined") {
    console.warn(`[tts] no window obj`);
    return;
  }

  const voices = window.speechSynthesis.getVoices();
  voiceMap = new Map<string, SpeechSynthesisVoice>(
    voices.map((voice) => [voiceId(voice), voice])
  );
}

function voiceId(voice: SpeechSynthesisVoice) {
  return `${voice.name}-${voice.lang}`;
}

export function speak(text: string, options?: SpeakOptions) {
  if (typeof window === "undefined") {
    console.warn("[tts] no window obj");
    return;
  }

  if (!voiceMap) {
    initVoiceMap();
  }

  const {
    force,
    pitch = 1,
    rate = 1,
    volume = 0.5,
    lang,
    voiceId,
  } = options || {};

  const utterance = new SpeechSynthesisUtterance(text);

  utterance.pitch = pitch;
  utterance.rate = rate;
  utterance.volume = volume;
  if (lang) utterance.lang = lang;

  utterance.voice = voiceId ? getVoice(voiceId) : null;

  if (utterance.voice) {
    if (lang != utterance.voice.lang) {
      console.log(`ttslang=${lang || "undefined"} != voice.lang=${utterance.voice.lang}`);
      return;
    }
  }
  // NOTE: potential memory leak
  if (options?.onstart) utterance.addEventListener("start", options.onstart);
  if (options?.onerror) utterance.addEventListener("error", options.onerror);
  if (options?.onend) utterance.addEventListener("end", options.onend);
  if (options?.onmark) utterance.addEventListener("mark", options.onmark);
  if (options?.onpause) utterance.addEventListener("pause", options.onpause);
  if (options?.onboundary)
    utterance.addEventListener("boundary", options.onboundary);

  if (force) window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

// TODO add lang param
function getVoices(filter?: Partial<SpeechSynthesisVoice>) {
  let voices = window.speechSynthesis.getVoices();
  if (filter) {
    voices = voices.filter((voice) => {
      return filter.lang && filter.lang === voice.lang;
    });
  }

  return voices;
}

function getVoicesByLang(lang: TTSLang) {
  return window.speechSynthesis
    .getVoices()
    .filter((voice) => voice.lang === lang);
}

function getVoice(id: VoiceId) {
  const voice = voiceMap.get(id);
  if (!voice) {
    throw Error("voice id not mapped to voice");
  }
  return voice;
}

const tts = {
  speak,
  getVoices,
  getVoicesByLang,
  getVoice,
  voiceId,
};

export default tts;
