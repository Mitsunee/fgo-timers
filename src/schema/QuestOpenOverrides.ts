import path from "path";
import { z } from "zod";
import { Log } from "~/utils/log";
import { ParsedYaml } from "./ParsedYaml";
import { zDate } from "./zDate";

export type QuestOpenOverrides = PartialDataMap<number>;

const _zOverrideKey = z
  .string()
  .regex(
    /^[A-Z]([A-Z_]*[A-Z])?$/,
    "openTimeOverrides constants may only use uppercase letters and underscores and must start with a letter."
  );
const _zTimeStamp = z.number().min(1498449600);
export const questOpenFilePath = path.join(
  process.cwd(),
  "assets/data/upgrades/openTimeOverrides.yml"
);

export const QuestOpenOverridesSchema = z.object({
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
});

export const QuestOpenOverridesFile = new ParsedYaml({
  name: "Quest Open Overrides",
  limitPath: questOpenFilePath,
  schema: QuestOpenOverridesSchema,
  transform: ({ overrides, constants }) => {
    const overridesMapped: QuestOpenOverrides = {};
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
        Log.throw(`Unrecognized constant or date for quest id ${key}`);
      }

      overridesMapped[key] = mappedVal;
    }

    return overridesMapped;
  }
});

export async function getQuestOpenOverrides() {
  const res = await QuestOpenOverridesFile.readFile(questOpenFilePath);
  if (!res.success) throw res.error;
  return res.data;
}
