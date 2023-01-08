import { z, type ZodSchema } from "zod";
import { Log } from "../utils/log";

/**
 * Verifies the data matches a Schema without transforms and prints errors if it doesn't. Returns boolean.
 */
export function verifySchema<T extends ZodSchema>(
  data: Partial<T["_type"]> | undefined | false,
  Schema: T,
  parent: string
): data is T["_type"] {
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

/**
 * Parses data using Schema with transforms and prints errors if it doesn't match Schema. Returns transformed data or undefined on failure.
 */
export function parseSchema<T extends ZodSchema>(
  data: Partial<T["_input"]> | undefined | false,
  Schema: T,
  parent: string
): T["_output"] | void {
  try {
    return Schema.parse(data);
  } catch (e) {
    if (e instanceof z.ZodError) {
      Log.zodError(e, parent);
    } else {
      Log.error("Unexpected SchemaError", e);
    }
    return;
  }
}
