import path from "path";
import type { BundledEvent } from "~/events/types";
import { BundleFile } from "./Bundle";

export const name = "Events";
export const filePath = path.join(process.cwd(), "assets/static/events.json");
export const File = new BundleFile<BundledEvent[]>(filePath);

/**
 * Reads Events bundle
 * @returns Bundled data
 */
export const getBundledEvents = File.readFile.bind(File);

/**
 * Writes to Events bundle
 * @param data Array of bundled Events
 * @returns FileWriteResult
 */
export const writeBundledEvents = File.writeFile.bind(File);
