import type { BundledEvent } from "src/events/types";
import { getBundledEvents } from "src/utils/getBundles";
import { Log } from "src/utils/log";

let events: BundledEvent[];

export async function getEventProps(slug: string): Promise<BundledEvent> {
  events ??= await getBundledEvents();
  const event = events.find(event => event.slug == slug);

  if (!event) {
    Log.throw(`Could not find event ${slug}`);
  }

  return event;
}
