import { composeBlock, composeJamo, composeSyllable, initialJamoOffset, isFinalJamo, isInitialJamo, isMedialJamo, jamo } from '../jamo'
import { describe, expect, test } from 'vitest'

describe('hangul', () => {
    const jamoCodeMap = (arr: string[]) => arr.map(j => [j, j.charCodeAt(0)])

    test.each(jamoCodeMap(jamo.initial))('%s: %d', (j, code) => {
        expect(j).toSatisfy(isInitialJamo)
    })
    test.each(jamoCodeMap(jamo.medial))('%s: %d', (j, code) => {
        expect(j).toSatisfy(isMedialJamo)
    })
    test.each(jamoCodeMap(jamo.final))('%s: %d', (j, code) => {
        expect(j).toSatisfy(isFinalJamo)
    })
    test.each([
        ['ㅜ', 'ㅔ', 'ㅞ',],
        ['ㅜ', 'ㅓ', 'ㅝ',],
        ['ㅜ', 'ㅣ', 'ㅟ',],
        ['ㄹ', 'ㄱ', 'ㄺ',],
        ['ㄹ', 'ㅁ', 'ㄻ',],
        ['ㄹ', 'ㅂ', 'ㄼ',],
        ['ㅗ', 'ㅐ', 'ㅙ',],
    ])('%s + %s = %s', (pre, post, jamo) => {
        expect(composeJamo(pre, post)).toBe(jamo)
    })

    test.each([['ㅜ', 'ㅅ', 'ㅞ']])('%s + %s = %s', (pre, post, jamo) => {
        expect(composeJamo(pre, post)).toBeUndefined()
    })

    test.each([
        ['ㄱ', 0],
        ['ㅉ', 13],
    ])('%s: %d', (jamo, off) => {
        expect(initialJamoOffset(jamo)).toBe(off)
    })


    test.each([
        ['ㄱ', 'ㅏ', '', '가'],
        ['ㄱ', 'ㅡ', 'ㄹ', '글'],
        ['ㅈ', 'ㅢ', 'ㄹ', '즬'],
        ['ㄹ', 'ㅝ', 'ㄼ', '뤏'],
        ['ㄱ', 'ㅙ', 'ㅐ', '괘'],
    ])('%s + %s + %s = %s', (i, m, f, s) => {
        expect(composeSyllable(i, m, f)).toBe(s)
    })


    test.todo('fix composeBlock tests')
    test.each([
        { jamo: [''], result: [''] },
        { jamo: [' '], result: [' '] },
        { jamo: [' ', 'ㅎ'], result: [' ', 'ㅎ'] },
        { jamo: ['ㄱ'], result: ['ㄱ'] },
        { jamo: ['ㄹ', 'ㄹ'], result: ['ㄹ', 'ㄹ'] },
        { jamo: ['ㅜ', 'ㅓ'], result: ['ㅝ'] },
        { jamo: ['ㄴ', 'ㅗ', 'ㄹ'], result: ['놀'] },
        { jamo: ['ㄴ', 'ㅗ', 'ㄹ', 'ㅏ'], result: ['노', 'ㄹ', 'ㅏ'] },
        { jamo: ['ㄱ', 'ㅗ', 'ㅐ'], result: ['괘'] },
        { jamo: ['ㄱ', 'ㅜ', 'ㅓ', 'ㄱ'], result: ['궉'] },
        { jamo: ['ㄱ', 'ㅜ', 'ㅓ', 'ㅏ'], result: ['궈', 'ㅏ'] },
        { jamo: ['ㄱ', 'ㅜ', 'ㅓ', 'ㄱ', 'ㅏ'], result: ['궈', 'ㄱ', 'ㅏ'] },
        { jamo: ['ㄱ', 'ㅜ', 'ㅓ', 'ㄱ', 'ㅅ'], result: ['궋'] },
        { jamo: ['ㄱ', 'ㅜ', 'ㅓ', 'ㄱ', 'ㅅ', 'ㅣ'], result: ['궉', 'ㅅ', 'ㅣ'] },
    ])('$jamo -> $result', ({ jamo, result }) => {
        expect(composeBlock(jamo)).toStrictEqual(result)
    })

})