import { buffer } from "./util"

// TODO: double type option for doubles (ㅃㅉㄸㄲㅆ)

export const jamo = {
    initial: [
        'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
        'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
    ],
    medial: [
        'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ',
        'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ',
        'ㅛ',
        'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ',
        'ㅠ',
        'ㅡ', 'ㅢ',
        'ㅣ'
    ],
    final: [
        'ㄱ', 'ㄲ', 'ㄳ',
        'ㄴ', 'ㄵ', 'ㄶ',
        'ㄷ',
        'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ',
        'ㅁ',
        'ㅂ', 'ㅄ',
        'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
    ],
    complexMaps: {
        'ㅗ': {
            'ㅏ': 'ㅘ',
            'ㅐ': 'ㅙ',
            'ㅣ': 'ㅚ'
        },
        'ㅜ': {
            'ㅓ': 'ㅝ',
            'ㅔ': 'ㅞ',
            'ㅣ': 'ㅟ'
        },
        'ㅡ': {
            'ㅣ': 'ㅢ'
        },
        'ㄱ': {
            'ㅅ': 'ㄳ'
        },
        'ㄴ': {
            'ㅈ': 'ㄵ',
            'ㅎ': 'ㄶ'
        },
        'ㄹ': {
            'ㄱ': 'ㄺ',
            'ㅁ': 'ㄻ',
            'ㅂ': 'ㄼ',
            'ㅅ': 'ㄽ',
            'ㅌ': 'ㄾ',
            'ㅍ': 'ㄿ',
            'ㅎ': 'ㅀ',
        },
        'ㅂ': {
            'ㅅ': 'ㅄ'
        }
    }
}

function isInitialJamo(j: string) {
    return jamo.initial.includes(j)
}

function isMedialJamo(j: string) {
    return jamo.medial.includes(j)
}

function isFinalJamo(j: string) {
    return jamo.final.includes(j)
}

function initialJamoOffset(j: string) {
    return jamo.initial.indexOf(j)
}

function medialJamoOffset(j: string) {
    return jamo.medial.indexOf(j)
}

function finalJamoOffset(j: string) {
    return jamo.final.indexOf(j)
}

function composeJamo(prefix: string, postfix: string) {
    if (prefix === undefined) return undefined
    if (postfix === undefined) return undefined
    const prefixMap = (jamo.complexMaps as any)[prefix]
    if (prefixMap === undefined) return undefined
    const complex = prefixMap[postfix]
    if (complex === undefined) return undefined
    return prefixMap[postfix]
}

function composeSyllable(initial: string, medial: string, final?: string) {
    const i = initialJamoOffset(initial)
    const m = medialJamoOffset(medial)
    const f = final ? finalJamoOffset(final) + 1 : 0

    const c = (i * 588 + m * 28 + f) + 44032
    return 0xAC00 <= c && c <= 0xD7A3 ? String.fromCodePoint(c) : undefined
}

const composeBlock = (input: string | string[]) => {
    const data = Array.isArray(input) ? [...input] : input.split("")

    let i: string | undefined = undefined
    let m: string | undefined = undefined
    let f: string | undefined = undefined
    let cc: string | undefined = undefined

    const buf = buffer(data)
    while (!buf.isEmpty()) {
        const p = buf.peek()!
        if (i === undefined) {
            if (isInitialJamo(p)) {
                const p2 = buf.peek(2)
                if (p2 === undefined) break
                if (!isMedialJamo(p2)) {
                    cc = buf.consume()
                    break
                }
                i = buf.consume()
                continue
            }
            if (isMedialJamo(p)) {
                const p2 = buf.peek(2)
                if (p2 === undefined) break
                cc = buf.consume()
                const cm = composeJamo(p, p2)
                if (cm === undefined) break
                cc = cm
                buf.consume()
                break
            }
        }

        if (m === undefined) {
            if (isMedialJamo(p)) {
                const c = buf.consume()!
                const p = buf.peek()
                if (p === undefined) {
                    m = c
                    break
                }
                const cm = composeJamo(c, p)
                if (cm) {
                    buf.consume()
                    m = cm
                    continue // ?
                }
                m = c
                continue
            }
            break
        }

        if (f === undefined) {
            if (!isFinalJamo(p)) break
            const p2 = buf.peek(2)
            if (p2 === undefined) {
                f = buf.consume()
                break
            }
            const cf = composeJamo(p, p2)
            if (cf) {
                const p3 = buf.peek(3)
                const c = buf.consume()
                if (p3 && isMedialJamo(p3)) {
                    f = c
                    break // recursion??
                }
                f = cf
                buf.consume()
                break
            }
            if (isMedialJamo(p2)) break
            f = buf.consume()
            break
        }
    }

    // deductive logic
    if (cc) return [cc, ...buf.data()]

    if (i && m) {
        const syl = composeSyllable(i, m, f)
        // TODO: consider throwing error (or alt fn that does)
        if (syl === undefined) return ['']
        if (buf.isEmpty()) return [syl]
        return [syl, ...buf.data()]
    }

    if (buf.isEmpty()) return ['']

    return [...buf.data()]
}

export {
    isInitialJamo, isMedialJamo, isFinalJamo,
    initialJamoOffset, medialJamoOffset, finalJamoOffset,
    composeJamo, composeSyllable, composeBlock
}