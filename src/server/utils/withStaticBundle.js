/* withStaticBundle
 * used to bundle static data files
 */

import { join } from "path";
import { fileExists, readFileJson, writeFile } from "@foxkit/node-util/fs";

import { createServerError } from "./createServerError";

export async function withStaticBundle(fileName, fallback, parent) {
  let data, usedCache;
  const filePath = join(
    "cache",
    fileName.endsWith(".json") ? fileName : `${fileName}.json`
  );
  const error = createServerError(
    "Could not build static bundle",
    parent || fileName
  );
  const isVercel = process.env.VERCEL == 1;

  try {
    // in vercel deployment use cache
    if (isVercel) {
      const exists = await fileExists(filePath);
      if (exists) {
        data = await readFileJson(filePath);
        if (data) usedCache = true;
      }
    }

    // use fallback function to generate data from static files (in dev or build step)
    if (!data) data = await fallback();

    // throw if no return
    if (!data) throw error;

    // save bundle
    if (!usedCache && isVercel) {
      await writeFile(filePath, data);
      console.log(`Wrote static bundle at '${filePath}'`);
    }

    return data;
  } catch (e) {
    console.error(error);
    throw e;
  }
}
