import { createEventSorter } from "src/events/sortEvents";
import { toBasicEvent } from "src/events/toBasicEvent";
import { getBundledEvents } from "src/utils/getBundles";

export async function getEventProps() {
  const events = await getBundledEvents();
  const now = Math.trunc(Date.now() / 1000);

  return events
    .filter(event => event.hideAt > now)
    .sort(createEventSorter(now))
    .map(toBasicEvent);
}
