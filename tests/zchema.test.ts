
import { test, expect } from 'vitest'

import zchema from "~/utils/zchema"


test.each([
  "ily", // shortest
  "abcdesdfgthrked", // longest
  "ffa353", // with number
  "353fda", // starts with number
  "8765434", // only numbers
])('%s', (handle) => {
  expect(() => zchema.userHandle.parse(handle)).not.toThrow()
})

test.each([
  "il", // too short
  "abcdesdfgthrkedf", // too long
  "faf_faa", // with symbol
  "faf faa", // with space
])('%s', (handle) => {
  expect(() => zchema.userHandle.parse(handle)).toThrow()
})