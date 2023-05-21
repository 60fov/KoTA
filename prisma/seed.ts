import { prisma } from "../src/server/db";
import { faker } from "@faker-js/faker";
import { createId as cuid } from "@paralleldrive/cuid2";


const users = Array.from({ length: 5 }).map(() => ({
  id: cuid(),
  name: faker.internet.displayName(),
  email: faker.internet.email(),
  image: faker.internet.avatar(),
  wordCount: 0
}))
console.log(users)

async function main() {
  await prisma.user.createMany({
    data: users,
    skipDuplicates: true
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