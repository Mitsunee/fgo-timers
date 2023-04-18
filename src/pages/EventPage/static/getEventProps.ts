import type { BundledEvent } from "src/events/types";
import { normalizeDate } from "src/time/normalizeDate";
import { getBuildInfo } from "src/utils/getBuildInfo";
import { getBundledEvents } from "src/utils/getBundles";

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

export async function createEventActiveFilter() {
  const { date } = await getBuildInfo();
  return (event: BundledEvent) => {
    const [start, end] = normalizeDate(event.date);
    if (end > 0) {
      return date >= start && date < end;
    }

    return date < start;
  };
}

export const NOT_FOUND = { notFound: true as const };
