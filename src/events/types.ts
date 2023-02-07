import type { EventDataParsed } from "src/schema/EventSchema";

export interface BundledEvent extends EventDataParsed {
  slug: string;
  hideAt: number;
}

export type BasicEvent = Pick<
  BundledEvent,
  "title" | "shortTitle" | "slug" | "date" | "banner"
>;
