import { join } from "path";
import { writeFile } from "@foxkit/node-util/fs";

import { ATLAS_API } from "../shared/constants.mjs";
import { fetchData } from "../shared/fetchData.mjs";

const API = `${ATLAS_API}export/`;

export async function updateCache(url) {
  const filepath = join("cache", url);
  const res = await fetchData(`${API}${url}`);
  writeFile(filepath, res);
}
