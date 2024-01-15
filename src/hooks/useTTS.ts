import { useTTSSettingsStore } from "~/utils/stores";
import tts, { type SpeakOptions } from "~/utils/tts";

export default function useTTS(options?: SpeakOptions) {
  const settings = useTTSSettingsStore();

  if (options) {
    switch (options.lang) {
      case "en-US":
        options.voiceId = settings.enVoiceId;
        break;
      case "ko-KR":
        options.voiceId = settings.krVoiceId;
        break;
    }
  }

  const opts = { ...settings, ...options };

  const speak = (text: string, o?: SpeakOptions) => {
    if (settings.enabled) tts.speak(text, {...opts, ...o});
  };

  return speak;
}
