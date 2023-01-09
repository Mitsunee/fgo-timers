import { readFileJson } from "@foxkit/node-util/fs";
import { join } from "path";
import { Log } from "src/utils/log";
import { BundledEvent } from "./types";

const eventsPath = join("assets", "static", "events.json");
export async function getBundledEvents(): Promise<BundledEvent[]> {
  const data = await readFileJson<BundledEvent[]>(eventsPath);
  if (!data) {
    Log.error(`Could not read ${eventsPath}`);
    throw new Error("File not found");
  }
  return data;
}
