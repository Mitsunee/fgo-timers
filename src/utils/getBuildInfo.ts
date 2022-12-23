import { join } from "path";
import { readFileJson } from "@foxkit/node-util/fs";
import { Log } from "./log";

const infoPath = join("assets", "static", "info.json");

export async function getBuildInfo(): Promise<BuildInfo> {
  const info = await readFileJson<BuildInfo>(infoPath);
  if (!info) {
    Log.error(`Could not read ${infoPath}`);
    throw new Error("File not found");
  }
  return info;
}
