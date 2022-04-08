import { readStaticBundle } from "src/server/utils/static";
import { filterHiddenEvents } from "./filterHiddenEvents";
import { stripUnusedProps } from "./stripUnusedProps";

const requiredProps = new Set([
  "title",
  "shortTitle",
  "slug",
  "banner",
  "start"
]);

const optionalProps = new Set(["end"]);

export async function getCurrentEvents(now) {
  const bundle = await readStaticBundle("events");
  const currentEvents = filterHiddenEvents(bundle, now);
  return stripUnusedProps(currentEvents, requiredProps, optionalProps);
}
