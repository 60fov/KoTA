import { decompose } from "lib/kime/jamo"
import { bench, describe } from "vitest"
import { wordList } from "~/utils/words"

describe('decompose', () => {
  bench('decompose', () => {
    wordList.forEach(({ kr }) => decompose(kr))
  },)
})

