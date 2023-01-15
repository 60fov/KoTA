// TODO: types
// type LayoutGroup = ... (qwerty)
// type Layout = ... (sebeolsik)

// TODO: add layouts
// each layout is ordered by rows grouped by caps
export const layout = {
    qwerty: {
        sebeolsik: {
            // duping feels less gross than performing two lookups for a miss (see keyLookUp fn)
            // or a reverse map whic seems less gross than the former but still too complex for no gain
            "Q": "ㅃ", "W": "ㅉ", "E": "ㄸ", "R": "ㄲ", "T": "ㅆ", "Y": "ㅛ", "U": "ㅕ", "I": "ㅑ", "O": "ㅒ", "P": "ㅖ",
            "A": "ㅁ", "S": "ㄴ", "D": "ㅇ", "F": "ㄹ", "G": "ㅎ", "H": "ㅗ", "J": "ㅓ", "K": "ㅏ", "L": "ㅣ",
            "Z": "ㅋ", "X": "ㅌ", "C": "ㅊ", "V": "ㅍ", "B": "ㅠ", "N": "ㅜ", "M": "ㅡ",

            "q": "ㅂ", "w": "ㅈ", "e": "ㄷ", "r": "ㄱ", "t": "ㅅ", "y": "ㅛ", "u": "ㅕ", "i": "ㅑ", "o": "ㅐ", "p": "ㅔ",
            "a": "ㅁ", "s": "ㄴ", "d": "ㅇ", "f": "ㄹ", "g": "ㅎ", "h": "ㅗ", "j": "ㅓ", "k": "ㅏ", "l": "ㅣ",
            "z": "ㅋ", "x": "ㅌ", "c": "ㅊ", "v": "ㅍ", "b": "ㅠ", "n": "ㅜ", "m": "ㅡ",

            // " ": " " // this one went crazy, rip, Sat Dec 3:17, qq
        }
    }
} // as const
/*
usage e.g.
const keymap = layout.qwerty.sebeolsik
keymap['P']
*/

// TODO: learn ts
export type EnLayout = "qwerty"
export type KrLayout = "sebeolsik"


// TODO: fix undefined lookup
export function getKeymap(enLayout: EnLayout, krLayout: KrLayout) {
    return (layout as any)[enLayout][krLayout] // as { [key: string]: string }
}

// TODO: add state for default layouts(?) (see hook)
export function keyLookUp(key: string, en: EnLayout = "qwerty", kr: KrLayout = "sebeolsik") {
    return getKeymap(en, kr)[key] as string | undefined // || getKeymap(en, kr)[key.toLowerCase()]
}