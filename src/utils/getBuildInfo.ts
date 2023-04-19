import { join } from "path";
import { readFileJson } from "@foxkit/node-util/fs";
import { Log } from "./log";

const infoPath = join(process.cwd(), "assets", "static", "info.json");

let info: BuildInfo | false | undefined = undefined;

export async function getBuildInfo(): Promise<BuildInfo> {
  info ??= await readFileJson<BuildInfo>(infoPath);
  if (!info) {
    Log.error(`Could not read ${infoPath}`);
    throw new Error("File not found");
  }
  return info;
}
