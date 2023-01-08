import type { EventDataParsed } from "src/schema/EventSchema";

export interface BundledEvent extends EventDataParsed {
  hideAt: number;
}
