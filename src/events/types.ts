import type { EventDataParsed } from "src/schema/EventSchema";

export interface BundledEvent extends EventDataParsed {
  slug: string;
  hideAt: number;
}
