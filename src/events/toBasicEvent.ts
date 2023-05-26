import type { BasicEvent, BundledEvent } from "./types";

/**
 * Creates BasicEvent object from BundledEvent
 * @param event Event to reduce
 * @returns BasicEvent
 */
export function toBasicEvent(event: BundledEvent): BasicEvent {
  return {
    title: event.title,
    shortTitle: event.shortTitle,
    slug: event.slug,
    date: event.date,
    banner: event.banner
  };
}
