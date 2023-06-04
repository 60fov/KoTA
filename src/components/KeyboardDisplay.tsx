import { cn } from "~/utils/fns";
import Key from "./ui/Key";
import { useKio } from "~/utils/hooks";
import { useKeyboardSettingsStore } from "~/utils/stores";

export default function KeyboardDisplay() {

  const keyboardEnabled = useKeyboardSettingsStore(({ enabled }) => enabled)

  const shift = useKio("Shift")

  if (!keyboardEnabled) {
    return null
  }

  return (
    <div className={cn(
      "flex flex-col items-stretch gap-[2px]",
      "w-[620px]"
    )}>
      <div
        className={"flex gap-[3px]"}>
        <Key code="Tab" expand />
        <Key code="q" label={shift ? 'ㅃ' : 'ㅂ'} />
        <Key code="w" label={shift ? 'ㅉ' : 'ㅈ'} />
        <Key code="e" label={shift ? 'ㄸ' : 'ㄷ'} />
        <Key code="r" label={shift ? 'ㄲ' : 'ㄱ'} />
        <Key code="t" label={shift ? 'ㅆ' : 'ㅅ'} />
        <Key code="y" label={'ㅛ'} />
        <Key code="u" label={'ㅕ'} />
        <Key code="i" label={'ㅑ'} />
        <Key code="o" label={shift ? 'ㅒ' : 'ㅐ'} />
        <Key code="p" label={shift ? 'ㅖ' : 'ㅔ'} />
        <Key code="[" />
        <Key code="]" />
        <Key code="\" />
      </div>
      <div
        className={"flex gap-[3px]"}>
        <Key code="" expand />
        <Key code="a" label={"ㅁ"} />
        <Key code="s" label={"ㄴ"} />
        <Key code="d" label={"ㅇ"} />
        <Key code="f" label={"ㄹ"} />
        <Key code="g" label={"ㅎ"} />
        <Key code="h" label={"ㅗ"} />
        <Key code="j" label={"ㅓ"} />
        <Key code="k" label={"ㅏ"} />
        <Key code="l" label={"ㅣ"} />
        <Key code=";" />
        <Key code="'" />
        <Key code="Enter" expand />
      </div>
      <div
        className={"flex gap-[3px]"}>
        <Key code="Shift" expand />
        <Key code="z" label={"ㅋ"} />
        <Key code="x" label={"ㅌ"} />
        <Key code="c" label={"ㅊ"} />
        <Key code="v" label={"ㅍ"} />
        <Key code="b" label={"ㅠ"} />
        <Key code="n" label={"ㅜ"} />
        <Key code="m" label={"ㅡ"} />
        <Key code="," />
        <Key code="." />
        <Key code="/" />
        <Key code="Shift" expand />
      </div>
    </div>
  )
}