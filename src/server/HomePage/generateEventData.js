import { getFileList } from "../utils/getFileList";
import { parseEventFile } from "../utils/parseEventFile";
import { getCurrentTime } from "../utils/getCurrentTime";

const eventProperties = new Set([
  "title",
  "shortTitle",
  "slug",
  "banner",
  "start"
]);

const optionalEventProperties = new Set(["end", "displayOrder"]);

export async function generateEventData() {
  const eventFiles = await getFileList("assets/data/events");
  let events = new Array();
  const currentTime = getCurrentTime();

  for (const filePath of eventFiles) {
    const data = await parseEventFile(filePath);
    // skip events that are supposed to be hidden
    if (data.hide && currentTime >= data.hide) continue;

    const event = new Object();

    // required properties
    for (const prop of eventProperties) {
      if (!data[prop]) {
        throw new Error(
          `Expected parsed event to have ${prop} property (for: '${filePath}')`
        );
      }
      event[prop] = data[prop];
    }

    // optional properties
    for (const prop of optionalEventProperties) {
      // check displayOrder first at it has a default value
      if (prop === "displayOrder") {
        event.order = data.displayOrder || 0;
        continue;
      }

      if (!data[prop]) continue;
      event[prop] = data[prop];
    }

    events.push(event);
  }

  // sort events
  events = events.sort((a, b) => {
    if (a.start === b.start) {
      return a.order - b.order;
    }

    return b.start - a.start;
  });

  return events;
}
