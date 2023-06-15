import { PrismaClient } from "@prisma/client";

import { env } from "~/env.mjs";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  })
    // create stats when creating user
    .$extends({
      query: {
        user: {
          async create({ args, query }) {
            args.data = {
              ...args.data,
              wordCount: 0,
            }
            return query(args)
          }
        }
      }
    })
    // delete extra words on word entry creation
    .$extends({
      query: {
        wordEntry: {
          async createMany({ args, query }) {
            const result = await query(args)
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
            const userId = (args.data as unknown as { userId: string }[])[0]?.userId!
            await deleteExtraWordEntries(userId)
            return result
          },
          async create({ args, query }) {
            const result = await query(args)
            const userId = args.data.userId!
            await deleteExtraWordEntries(userId)
            return result
          },
          async upsert({ args, query }) {
            const result = await query(args)
            const userId = args.create.userId!
            await deleteExtraWordEntries(userId)
            return result
          }
        }
      }
    });

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;


// TODO convert to raw query to reduce server db trips (?)
async function deleteExtraWordEntries(userId: string) {
  const extraEntries = await prisma.wordEntry.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    skip: 100,
    select: { id: true },
  })

  await prisma.wordEntry.deleteMany({
    where: {
      id: {
        in: extraEntries.map((row) => row.id)
      }
    },
  })
}

export { prisma }