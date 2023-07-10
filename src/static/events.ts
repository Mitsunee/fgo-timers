import path from "path";
import type { BundledEvent } from "~/events/types";
import { BundleFile } from "./Bundle";

const filePath = path.join(process.cwd(), "assets/static/events.json");
export const EventsFile = new BundleFile<BundledEvent[]>({
  name: "Events",
  filePath
});

/**
 * Reads Events bundle
 * @returns Bundled data
 */
export const getBundledEvents = EventsFile.readBundle.bind(EventsFile);

/**
 * Writes to Events bundle
 * @param data Array of bundled Events
 * @returns FileWriteResult
 */
export const writeBundledEvents = EventsFile.writeBundle.bind(EventsFile);
