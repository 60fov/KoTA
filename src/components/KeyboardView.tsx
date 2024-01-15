import { cn } from "~/utils/fns";
import Key from "./ui/Key";

import { useKeyboardSettingsStore } from "~/utils/stores";
import { useKioKey } from "~/hooks/kio";
import { motion } from "framer-motion";

export default function KeyboardView(props: {
  keySize?: number,
  hgap?: number,
  vgap?: number
}) {
  const {
    keySize = 44,
    hgap = 4,
    vgap = 2
  } = props


  const keyboardEnabled = useKeyboardSettingsStore(({ enabled }) => enabled)

  const shift = useKioKey("Shift")

  if (!keyboardEnabled) {
    return null
  }

  const width = (keySize + hgap) * 14.4

  return (
    <motion.div
      key="keyboard-view"
      transition={{ type: "spring", duration: 0.5 }}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}

      style={{ width, gap: vgap }}
      className={cn(
        "flex flex-col items-stretch",
      )}>
      <div
        style={{ gap: hgap }}
        className={"flex"}>
        <Key size={keySize} code="`" />
        <Key size={keySize} code="1" />
        <Key size={keySize} code="2" />
        <Key size={keySize} code="3" />
        <Key size={keySize} code="4" />
        <Key size={keySize} code="5" />
        <Key size={keySize} code="6" />
        <Key size={keySize} code="7" />
        <Key size={keySize} code="8" />
        <Key size={keySize} code="9" />
        <Key size={keySize} code="0" />
        <Key size={keySize} code="-" />
        <Key size={keySize} code="=" />
        <Key size={keySize} code="Delete" expand />
      </div>
      <div
        style={{ gap: hgap }}
        className={"flex"}>
        <Key size={keySize} code="Tab" expand />
        <Key size={keySize} code="q" label={shift ? 'ㅃ' : 'ㅂ'} />
        <Key size={keySize} code="w" label={shift ? 'ㅉ' : 'ㅈ'} />
        <Key size={keySize} code="e" label={shift ? 'ㄸ' : 'ㄷ'} />
        <Key size={keySize} code="r" label={shift ? 'ㄲ' : 'ㄱ'} />
        <Key size={keySize} code="t" label={shift ? 'ㅆ' : 'ㅅ'} />
        <Key size={keySize} code="y" label={'ㅛ'} />
        <Key size={keySize} code="u" label={'ㅕ'} />
        <Key size={keySize} code="i" label={'ㅑ'} />
        <Key size={keySize} code="o" label={shift ? 'ㅒ' : 'ㅐ'} />
        <Key size={keySize} code="p" label={shift ? 'ㅖ' : 'ㅔ'} />
        <Key size={keySize} code="[" />
        <Key size={keySize} code="]" />
        <Key size={keySize} code="\" />
      </div>
      <div
        style={{ gap: hgap }}
        className={"flex"}>
        <Key size={keySize} code="" expand />
        <Key size={keySize} code="a" label={"ㅁ"} />
        <Key size={keySize} code="s" label={"ㄴ"} />
        <Key size={keySize} code="d" label={"ㅇ"} />
        <Key size={keySize} code="f" label={"ㄹ"} />
        <Key size={keySize} code="g" label={"ㅎ"} />
        <Key size={keySize} code="h" label={"ㅗ"} />
        <Key size={keySize} code="j" label={"ㅓ"} />
        <Key size={keySize} code="k" label={"ㅏ"} />
        <Key size={keySize} code="l" label={"ㅣ"} />
        <Key size={keySize} code=";" />
        <Key size={keySize} code="'" />
        <Key size={keySize} code="Enter" expand />
      </div>
      <div
        style={{ gap: hgap }}
        className={"flex"}>
        <Key size={keySize} code="Shift" expand />
        <Key size={keySize} code="z" label={"ㅋ"} />
        <Key size={keySize} code="x" label={"ㅌ"} />
        <Key size={keySize} code="c" label={"ㅊ"} />
        <Key size={keySize} code="v" label={"ㅍ"} />
        <Key size={keySize} code="b" label={"ㅠ"} />
        <Key size={keySize} code="n" label={"ㅜ"} />
        <Key size={keySize} code="m" label={"ㅡ"} />
        <Key size={keySize} code="," />
        <Key size={keySize} code="." />
        <Key size={keySize} code="/" />
        <Key size={keySize} code="Shift" expand />
      </div>
    </motion.div>
  )
}