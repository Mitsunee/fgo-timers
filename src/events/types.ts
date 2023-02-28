import type { EventDataParsed } from "src/schema/EventSchema";

export interface BundledEvent extends EventDataParsed {
  slug: string;
  /**
   * Time at which to hide event from HomePage's EventList
   */
  hideAt: number;
}

export type BasicEvent = Pick<
  BundledEvent,
  "title" | "shortTitle" | "slug" | "date" | "banner"
>;
