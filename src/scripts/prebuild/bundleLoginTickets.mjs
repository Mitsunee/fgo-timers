import { join } from "path";
import { readdir } from "fs/promises";
import { writeFile } from "@foxkit/node-util/fs";
import { resolvePath, getFileName } from "@foxkit/node-util/path";

import { isTicketFile } from "../utils/data-assets/isDataFile.mjs";
import { parseTicketFile } from "../utils/data-assets/parseTicketFile.mjs";
import { ready } from "../utils/log.mjs";

export async function bundleLoginTickets() {
  const path = resolvePath("assets/data/login-tickets/");
  const dir = await readdir(path);
  const files = dir.map(file => join(path, file)).filter(isTicketFile);
  const dataEntries = await Promise.all(
    files.map(async file => [
      getFileName(file, false),
      await parseTicketFile(file)
    ])
  );
  const data = Object.fromEntries(dataEntries);

  await writeFile("assets/static/loginTickets.json", data);

  ready("Built login-tickets bundle", "assets/static/loginTickets.json");
  return true;
}
