import { join } from "path";
import { ATLAS_API } from "../shared/constants.mjs";
import { fetchData } from "../shared/fetchData.mjs";
import { writeFile } from "../shared/fs-helper.mjs";

const API = `${ATLAS_API}export/`;

export async function updateCache(url) {
  const filepath = join("cache", url);
  const res = await fetchData(`${API}${url}`);
  writeFile(filepath, res);
}
