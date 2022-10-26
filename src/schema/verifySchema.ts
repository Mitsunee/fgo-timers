import { z, ZodSchema } from "zod";
import { Log } from "../utils/log";

export function verifySchema<T>(
  data: Partial<T>,
  Schema: ZodSchema<T>,
  parent: string
): data is T {
  try {
    Schema.parse(data);
    return true;
  } catch (e) {
    if (e instanceof z.ZodError) {
      Log.zodError(e, parent);
    } else {
      Log.error("Unexpected SchemaError", e);
    }
    return false;
  }
}
