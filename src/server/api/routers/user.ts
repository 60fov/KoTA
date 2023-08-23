import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import zchema from "~/utils/zchema";

export const userRouter = createTRPCRouter({
  isHandleTaken: publicProcedure
    .input(zchema.userHandle)
    .query(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { handle: input }
      })

      return !!user
    }),
  getUserCardInfo: publicProcedure
    .input(z.object({
      id: z.string().optional(),
      handle: z.string().optional(),
    })).query(async ({ input, ctx }) => {
      const { handle, id } = input

      if (!handle && !id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "missing user identifier. requestion should send either the user handle or id",
        })
      }

      const data = await ctx.prisma.user.findUniqueOrThrow({
        where: handle ? { handle } : { id },
        select: {
          wordCount: true,
          wordEntries: true
        }
      })

      // sum values
      const accum = data.wordEntries
        .reduce((accum, entry) => {
          accum.length += entry.length
          accum.period += entry.period
          accum.strokes += entry.strokes
          return accum
        }, {
          length: 0,
          strokes: 0,
          period: 0
        })

      // calc stats
      const acc = accum.length / accum.strokes
      const wpm = 60 * 1000 * data.wordEntries.length / accum.period

      const wordEntries = data.wordEntries.map((entry) => {
        const { userId, ...result } = entry
        return result
      })

      return {
        acc,
        wpm,
        wordEntries,
        wordCount: data.wordCount,
      }
    }),
  getPublicProfile: publicProcedure
    .input(z.object({
      id: z.string().optional(),
      handle: z.string().optional(),
    }))
    .query(async ({ input, ctx }) => {
      const { handle, id } = input

      if (!handle && !id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "missing user identifier. requestion should send either the user handle or id",
        })
      }

      return await ctx.prisma.user.findUniqueOrThrow({
        where: handle ? { handle } : { id },
        select: {
          name: true,
          image: true,
          handle: true,
        }
      })
    }),
  getStats: publicProcedure
    .input(z.object({
      id: z.string().optional(),
      handle: z.string().optional(),
    }))
    .query(async ({ input, ctx }) => {
      const { handle, id } = input

      if (!handle && !id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "missing user identifier. requestion should send either the user handle or id",
        })
      }

      const data = await ctx.prisma.user.findUniqueOrThrow({
        where: handle ? { handle } : { id },
        select: {
          image: true,
          handle: true,
          wordCount: true,
          wordEntries: true
        }
      })

      // sum values
      const accum = data.wordEntries
        .reduce((accum, entry) => {
          accum.length += entry.length
          accum.period += entry.period
          accum.strokes += entry.strokes
          return accum
        }, {
          length: 0,
          strokes: 0,
          period: 0
        })

      // calc stats
      const acc = accum.length / accum.strokes
      const wpm = 60 * 1000 * data.wordEntries.length / accum.period

      const wordEntries = data.wordEntries.map((entry) => {
        const { userId, ...result } = entry
        return result
      })

      return {
        image: data.image,
        handle: data.handle,
        acc,
        wpm,
        wordEntries,
        wordCount: data.wordCount,
      }
    }),
  updateProfile: protectedProcedure
    .input(z.object({
      name: z.string().optional(),
      handle: zchema.userHandle.optional()
    }))
    .mutation(async ({ input, ctx }) => {
      const id = ctx.session.user.id
      const {
        name,
        handle
      } = input

      await ctx.prisma.user.update({
        where: { id },
        data: {
          name,
          handle,
        }
      })
    }),
  pushWordEntries: protectedProcedure
    .input(zchema.wordEntry.array())
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id

      const data = input.map((entry) => ({
        ...entry,
        userId
      }))

      await ctx.prisma.wordEntry.createMany({
        data
      })

      await ctx.prisma.user.update({
        where: { id: userId },
        data: {
          wordCount: {
            increment: input.length
          }
        }
      })
    })
});