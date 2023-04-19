import { z } from "zod";

const zchema = {
  userHandle: z.string().min(3).max(15).regex(/^[a-zA-Z0-9]+$/g),
  wordEntry: z.object({
    length: z.number(),
    strokes: z.number(),
    period: z.number()
  })
}

export default zchema