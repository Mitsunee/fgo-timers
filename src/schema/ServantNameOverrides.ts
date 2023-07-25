import path from "path";
import { z } from "zod";
import { ParsedYaml } from "./ParsedYaml";

export const servantNamesFilePath = path.join(
  process.cwd(),
  "assets/data/servants/nameOverrides.yml"
);

export const ServantNameOverridesSchema = z.record(
  z
    .string()
    .regex(/^\d+$/)
    .transform(val => Number(val)),
  z.string()
);

export const ServantNameOverridesFile = new ParsedYaml<
  typeof ServantNameOverridesSchema,
  Partial<Record<number, string>> // override type to be partial to avoid undefined values passing through in typechecks
>({
  limitPath: servantNamesFilePath,
  schema: ServantNameOverridesSchema
});

export async function getServantNameOverridesFile() {
  const res = await ServantNameOverridesFile.readFile(servantNamesFilePath);
  if (!res.success) throw res.error;
  return res.data;
}
