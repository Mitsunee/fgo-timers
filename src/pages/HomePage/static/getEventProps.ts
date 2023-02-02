import { createEventSorter } from "src/events/sortEvents";
import { getBundledEvents } from "src/utils/getBundles";

export async function getEventProps() {
  const events = await getBundledEvents();
  const now = Math.trunc(Date.now() / 1000);

  return events
    .filter(event => event.hideAt > now)
    .sort(createEventSorter(now))
    .map(event => ({
      title: event.title,
      shortTitle: event.shortTitle,
      slug: event.slug,
      date: event.date,
      banner: event.banner
    }));
}
