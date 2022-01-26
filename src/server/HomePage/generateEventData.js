import { getFileList } from "../utils/getFileList";
import { parseEventFile } from "../utils/parseEventFile";
import { getCurrentTime } from "../utils/getCurrentTime";

const eventProperties = new Set([
  "title",
  "shortTitle",
  "start",
  "end",
  "banner",
  "slug"
]);

export async function generateEventData() {
  const eventFiles = await getFileList("assets/data/events");
  const events = new Array();
  const currentTime = getCurrentTime();

  for (const filePath of eventFiles) {
    const data = await parseEventFile(filePath);
    // skip events that are supposed to be hidden
    if (data.hide && currentTime >= data.hide) continue;

    const event = new Object();
    for (const prop of eventProperties) {
      if (!data[prop]) {
        throw new Error(
          `Expected parsed event to have ${prop} property (for: '${filePath}')`
        );
      }
      event[prop] = data[prop];
    }

    events.push(event);
  }

  return events;
}
