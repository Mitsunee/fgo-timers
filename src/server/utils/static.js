import { readFileJson } from "@foxkit/node-util/fs";
import { createServerError } from "./createServerError";

/**
 * @deprecated Removal blocked by backgrounds in HomePage
 */
export async function readStaticBundle(bundle) {
  const fileName = bundle.endsWith(".json") ? bundle : `${bundle}.json`;

  const data = await readFileJson(`assets/static/${fileName}`);
  if (!data) {
    throw createServerError(`Could not find static bundle ${fileName}`);
  }

  return data;
}
