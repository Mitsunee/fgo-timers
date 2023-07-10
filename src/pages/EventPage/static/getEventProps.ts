import { getBundledEvents } from "~/static/events";
import type { BundledEvent } from "~/events/types";

type ValidateFn<T extends BundledEvent> = (event: BundledEvent) => event is T;

export async function getEventProps<T extends BundledEvent = BundledEvent>(
  slug: string,
  validate?: ValidateFn<T>
): Promise<T | void | false> {
  const events = await getBundledEvents();
  const event = events.find(event => event.slug == slug);
  if (!event) return;
  if (!validate) return event as T;
  if (!validate(event)) return false;
  return event;
}

export const NOT_FOUND = { notFound: true as const };
