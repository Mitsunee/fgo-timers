import type { BundledEvent } from "src/events/types";
import { getBundledEvents } from "src/utils/getBundles";
import { Log } from "src/utils/log";

type ValidateFn<T extends BundledEvent> = (event: BundledEvent) => event is T;

export async function getEventProps<T extends BundledEvent = BundledEvent>(
  slug: string,
  validate?: ValidateFn<T>
): Promise<T> {
  const events = await getBundledEvents();
  const event = events.find(event => event.slug == slug);

  if (!event) {
    Log.throw(`Could not find event ${slug}`);
  }

  if (!validate) return event as T;

  if (!validate(event)) {
    Log.throw(`Validation error for event ${slug}`);
  }

  return event;
}
