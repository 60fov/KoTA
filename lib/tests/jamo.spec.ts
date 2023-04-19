import {
    compose, composeBlock, composeJamo, composeSyllable,
    decompose, decomposeBlock,
    initialJamoOffset, isFinalJamo, isInitialJamo, isMedialJamo,
    jamo
} from '~/kime/jamo'
import { describe, expect, test } from 'vitest'

describe('hangul', () => {
    const jamoCodeMap = (arr: string[]) => arr.map(j => [j, j.charCodeAt(0)])

    test.each(jamoCodeMap(jamo.initial))('%s: %d', (j) => {
        expect(j).toSatisfy(isInitialJamo)
    })
    test.each(jamoCodeMap(jamo.medial))('%s: %d', (j) => {
        expect(j).toSatisfy(isMedialJamo)
    })
    test.each(jamoCodeMap(jamo.final))('%s: %d', (j) => {
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

    test.each([['ㅜ', 'ㅅ', 'ㅞ']])('%s + %s = %s', (pre, post) => {
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

    test.each([
        { jamo: [''], result: [''] },
        { jamo: [' '], result: [' '] },
        { jamo: [' ', 'ㅎ'], result: [' ', 'ㅎ'] },
        { jamo: ['ㄱ'], result: ['ㄱ'] },
        { jamo: ['ㄹ', 'ㄹ'], result: ['ㄹ', 'ㄹ'] },
        { jamo: ['ㅜ', 'ㅓ'], result: ['ㅝ'] },
        { jamo: ['ㄴ', 'ㅗ', 'ㄹ'], result: ['놀'] },
        { jamo: ['ㄴ', 'ㅗ', 'ㄹ', 'ㅏ'], result: ['노', '라'] },
        { jamo: ['ㄱ', 'ㅗ', 'ㅐ'], result: ['괘'] },
        { jamo: ['ㄱ', 'ㅜ', 'ㅓ', 'ㄱ'], result: ['궉'] },
        { jamo: ['ㄱ', 'ㅜ', 'ㅓ', 'ㅏ'], result: ['궈', 'ㅏ'] },
        { jamo: ['ㄱ', 'ㅜ', 'ㅓ', 'ㄱ', 'ㅏ'], result: ['궈', '가'] },
        { jamo: ['ㄱ', 'ㅜ', 'ㅓ', 'ㄱ', 'ㅅ'], result: ['궋'] },
        { jamo: ['ㄱ', 'ㅜ', 'ㅓ', 'ㄱ', 'ㅅ', 'ㅣ'], result: ['궉', '시'] },
        { jamo: ['ㄹ', 'ㅓ', 'ㄱ', 'ㅁ', 'ㅏ', 'ㅂ', 'ㅍ', ' ', 'ㅂ', 'ㅏ'], result: ['럭', '맙', 'ㅍ', ' ', '바'] },
        { jamo: ['ㅎ', 'ㅗ', 'ㅏ', 'ㅇ'], result: ['황'] },
    ])('$jamo -> $result', ({ jamo, result }) => {
        expect(compose(jamo)).toStrictEqual(result)
    })

    test.each([
        { block: '', jamo: [''] },
        { block: ' ', jamo: [' '] },
        { block: 'ㄱ', jamo: ['ㄱ'] },
        { block: '노', jamo: ['ㄴ', 'ㅗ'] },
        { block: 'ㅝ', jamo: ['ㅜ', 'ㅓ'] },
        { block: '놀', jamo: ['ㄴ', 'ㅗ', 'ㄹ'] },
        { block: '괘', jamo: ['ㄱ', 'ㅗ', 'ㅐ'] },
        { block: '궉', jamo: ['ㄱ', 'ㅜ', 'ㅓ', 'ㄱ'] },
        { block: '궋', jamo: ['ㄱ', 'ㅜ', 'ㅓ', 'ㄱ', 'ㅅ'] },
        { block: '황', jamo: ['ㅎ', 'ㅗ', 'ㅏ', 'ㅇ'] }
    ])('$block -> $jamo', ({ block, jamo }) => {
        expect(decomposeBlock(block)).toStrictEqual(jamo)
    })

    test.each([
        { blocks: '황', jamo: ['ㅎ', 'ㅗ', 'ㅏ', 'ㅇ'] },
        { blocks: '노 놀괘궉 궋', jamo: ['ㄴ', 'ㅗ', ' ', 'ㄴ', 'ㅗ', 'ㄹ', 'ㄱ', 'ㅗ', 'ㅐ', 'ㄱ', 'ㅜ', 'ㅓ', 'ㄱ', ' ', 'ㄱ', 'ㅜ', 'ㅓ', 'ㄱ', 'ㅅ'] },
    ])('$blocks -> $jamo', ({ blocks, jamo }) => {
        expect(decompose(blocks)).toStrictEqual(jamo)
    })



})