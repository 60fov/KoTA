import { decompose } from "lib/kime/jamo"
import { bench, describe } from "vitest"
import { Dict } from "~/utils/dictionary"

describe('decompose', () => {
  bench('decompose', () => {
    Dict.defaultWords.forEach(({ kr }) => decompose(kr))
  },)
})

