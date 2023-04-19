/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { buffer } from "./util"

// TODO: double type option for doubles (ㅃㅉㄸㄲㅆ)
// TODO: switch to bi directional maps

export const jamo = {
    single: [
        'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
        'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
        'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ',
        'ㅗ', 'ㅛ', 'ㅜ', 'ㅠ', 'ㅡ', 'ㅣ'
    ],
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
    decompositionMaps: {
        'ㅘ': ['ㅗ', 'ㅏ'],
        'ㅙ': ['ㅗ', 'ㅐ'],
        'ㅚ': ['ㅗ', 'ㅣ'],
        'ㅝ': ['ㅜ', 'ㅓ'],
        'ㅞ': ['ㅜ', 'ㅔ'],
        'ㅟ': ['ㅜ', 'ㅣ'],
        'ㅢ': ['ㅡ', 'ㅣ'],
        'ㄳ': ['ㄱ', 'ㅅ'],
        'ㄵ': ['ㄴ', 'ㅈ'],
        'ㄶ': ['ㄴ', 'ㅎ'],
        'ㄺ': ['ㄹ', 'ㄱ'],
        'ㄻ': ['ㄹ', 'ㅁ'],
        'ㄼ': ['ㄹ', 'ㅂ'],
        'ㄽ': ['ㄹ', 'ㅅ'],
        'ㄾ': ['ㄹ', 'ㅌ'],
        'ㄿ': ['ㄹ', 'ㅍ'],
        'ㅀ': ['ㄹ', 'ㅎ'],
        'ㅄ': ['ㅂ', 'ㅅ'],
    },
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

    const c = (i * 588 + m * 28 + f) + 0xac00
    return 0xac00 <= c && c <= 0xD7A3 ? String.fromCodePoint(c) : undefined
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

// TODO: dunno how I feel about this, promise version?
const compose = (blocks: string[], maxIterations = 1000) => {
    const result: string[] = []
    let b = blocks
    let i = 0
    while (b.length) {
        i++
        if (i > maxIterations) break
        const [block, ...rest] = composeBlock(b)
        result.push(block as string)
        b = rest
    }
    return result
}

const decomposeCompatibilityJamo = (cjamo: string) => {
    return (jamo.decompositionMaps as any)[cjamo] as string[] | undefined
}

const decomposeBlock = (block: string) => {
    const code = block.charCodeAt(0)
    if (0xac00 <= code && code <= 0xD7A3) {
        const c = code - 0xac00
        const fc = c % 28
        const i = Math.floor(c / 588)
        const m = (c - fc) % 588 / 28
        const f = fc ? fc - 1 : undefined

        const initial = jamo.initial[i]

        const decomposedMedial = decomposeCompatibilityJamo(jamo.medial[m] as string)
        const medial = decomposedMedial ?? [jamo.medial[m]]

        if (f !== undefined) {
            const decomposedFinal = decomposeCompatibilityJamo(jamo.final[f] as string)
            const final = decomposedFinal ?? [jamo.final[f]]

            return [initial, ...medial, ...final]
        }
        return [initial, ...medial]
    }

    const decomposedCompatibilityJamo = decomposeCompatibilityJamo(block)
    return decomposedCompatibilityJamo ?? [block]
}

const decompose = (blocks: string) => {
    const result: string[] = []
    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i]
        result.push(...decomposeBlock(block as string) as string[])
    }
    return result
}

export {
    isInitialJamo, isMedialJamo, isFinalJamo,
    initialJamoOffset, medialJamoOffset, finalJamoOffset,
    composeJamo, composeSyllable, composeBlock, compose,
    decomposeCompatibilityJamo, decomposeBlock, decompose
}