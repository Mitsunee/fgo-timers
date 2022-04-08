import { createServerError } from "src/server/utils/createServerError";

export function stripUnusedProps(events, requiredProps, optionalProps) {
  return events.map(event => {
    const processed = new Object();

    for (const prop of requiredProps) {
      if (!event[prop]) {
        throw createServerError(
          `Missing prop ${prop} in ${event.slug}`,
          "assets/static/events.json"
        );
      }

      processed[prop] = event[prop];
    }

    for (const prop of optionalProps) {
      if (event[prop]) processed[prop] = event[prop];
    }

    return processed;
  });
}
