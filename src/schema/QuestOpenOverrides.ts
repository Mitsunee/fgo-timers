import { z } from "zod";
import { zDate } from "./zDate";

const _zOverrideKey = z
  .string()
  .regex(
    /^[A-Z]([A-Z_]*[A-Z])?$/,
    "openTimeOverrides constants may only use uppercase letters and underscores and must start with a letter."
  );
const _zTimeStamp = z.number().min(1498449600);

export const QuestOpenOverridesSchema = z
  .object({
    constants: z.record(
      _zOverrideKey,
      z.union([_zTimeStamp, zDate, z.undefined()])
    ),
    overrides: z.record(
      z
        .string()
        .regex(/^\d+$/)
        .transform(val => Number(val)),
      z.union([_zOverrideKey, _zTimeStamp, zDate])
    )
  })
  .transform(({ overrides, constants }, ctx) => {
    const overridesMapped: IDMap<number> = {};
    const entries = Object.entries(overrides) as [
      `${number}`,
      string | number
    ][];

    for (const [key, val] of entries) {
      if (typeof val == "number") {
        overridesMapped[key] = val;
        continue;
      }

      const mappedVal = constants[val];
      if (typeof mappedVal == "undefined") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Unrecognized constant or date",
          path: ["overrides", key]
        });

        return z.NEVER;
      }

      overridesMapped[key] = mappedVal;
    }

    return overridesMapped;
  });

export type QuestOpenOverrides = {
  in: z.input<typeof QuestOpenOverridesSchema>;
  out: z.output<typeof QuestOpenOverridesSchema>;
};
