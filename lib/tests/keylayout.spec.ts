import { describe, expect, test } from 'vitest'

import { keyLookUp } from '~/kime/keylayout'

describe('qwerty-sebeolsik', () => {
    test.each([
        ['W', 'ㅉ'],
        ['w', 'ㅈ'],
        ["F", 'ㄹ'],
        ["f", 'ㄹ'],
        ["1", undefined],
    ])('%s -> %s', (k, j) => {
        expect(keyLookUp(k)).toBe(j)
    })
})