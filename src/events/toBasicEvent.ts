import type { BundledEvent, BasicEvent } from "./types";

export function toBasicEvent(event: BundledEvent): BasicEvent {
  return {
    title: event.title,
    shortTitle: event.shortTitle,
    slug: event.slug,
    date: event.date,
    banner: event.banner
  };
}
