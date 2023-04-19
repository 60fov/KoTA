import { describe, expect, test } from 'vitest'
import { buffer } from '../kime/util'
describe('buffer', () => {
    test('buffer consume', () => {
        const data = ['a', 'b', 'c']
        const buf = buffer(data)
        data.forEach(v => expect(buf.consume()).toBe(v))
        expect(buf.consume()).toBeUndefined()
        expect(buf.isEmpty()).toBe(true)
    })

    test('buffer peek', () => {
        const data = ['a', 'b', 'c']
        const buf = buffer(data)
        data.forEach((v, i) => {
            expect(buf.peek(i+1)).toBe(v)
        })
        expect(buf.peek(4)).toBeUndefined()
    })
})