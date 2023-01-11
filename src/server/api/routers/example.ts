import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

// TODO: remove example router after implementing some real ones :)

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`
      };
    })
});
