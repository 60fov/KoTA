import { faker } from "@faker-js/faker";
import { createId as cuid } from "@paralleldrive/cuid2";

import { prisma } from "../src/server/db";
import { decompose } from "../lib/kime/jamo";
import { random } from "../src/utils/fns";
import { wordList } from "../src/utils/words";
import { type WordEntry } from "@prisma/client";


const CPW = wordList.reduce((accum, { kr }) => accum + decompose(kr).length, 0) / wordList.length
console.log("CPW", CPW)

type WE = Omit<WordEntry, "id">
const wordEntries: WE[] = []

const users = Array.from({ length: 20 }).map((_, i) => {
  const wpm = random.int(20, 120)
  const acc = random.float(0.1, 1)
  const con = random.float(0.01, 0.99)
  const id = cuid()

  const entries = Array.from({ length: random.int(0, 100) }).map(() => {
    const word = random.fromArray(wordList)
    if (!word) throw Error()
    const length = decompose(word.kr).length
    const strokes = Math.floor(length * (1 + (1 - acc * con)))
    const period = (60 * 1000) / (wpm * CPW) * length
    return {
      createdAt: faker.date.recent({ days: 1 }),
      length,
      strokes,
      period,
      userId: id
    }
  })

  wordEntries.push(...entries)

  return {
    id,
    name: faker.internet.displayName(),
    email: faker.internet.email(),
    image: faker.internet.avatar(),
    handle: 'user' + String(i+1),
    wordCount: entries.length,
  }
})
console.log(users)

async function main() {
  await prisma.user.deleteMany({
    where: {
      name: {
        not: {
          equals: "ily"
        }
      }
    }
  })

  await prisma.user.createMany({
    data: users,
    skipDuplicates: true
  })

  await prisma.wordEntry.createMany({
    data: wordEntries,
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })