import { z } from "zod";
import { parseDate, parseDuration } from "~/time/parseDate";

export const zDate = z.string().transform((date, { addIssue }) => {
  try {
    return parseDate(date);
  } catch (e) {
    addIssue({
      code: z.ZodIssueCode.custom,
      message: e instanceof Error ? e.message : `${e}`
    });
    return z.NEVER;
  }
});

export const zDuration = z.string().transform((date, { addIssue }) => {
  try {
    return parseDuration(date, null);
  } catch (e) {
    addIssue({
      code: z.ZodIssueCode.custom,
      message: e instanceof Error ? e.message : `${e}`
    });
    return z.NEVER;
  }
});

export const zDurationStrict = z.string().transform((date, { addIssue }) => {
  try {
    return parseDuration(date, true);
  } catch (e) {
    addIssue({
      code: z.ZodIssueCode.custom,
      message: e instanceof Error ? e.message : `${e}`
    });
    return z.NEVER;
  }
});
