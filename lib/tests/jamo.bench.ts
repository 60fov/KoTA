import { decompose } from "lib/kime/jamo"
import { bench, describe } from "vitest"
import { WordList } from "~/utils/words"

describe('decompose', () => {
  bench('decompose', () => {
    WordList.forEach(({ kr }) => decompose(kr))
  },)
})

