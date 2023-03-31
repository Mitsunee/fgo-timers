import { createEventSorter } from "src/events/sortEvents";
import { toBasicEvent } from "src/events/toBasicEvent";
import { getBundledEvents } from "src/utils/getBundles";

export async function getEventProps(now: number) {
  const events = await getBundledEvents();

  return events
    .filter(event => event.hideAt > now)
    .sort(createEventSorter(now))
    .map(toBasicEvent);
}
