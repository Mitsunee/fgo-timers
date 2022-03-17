import { test } from "uvu";
import * as assert from "uvu/assert";
import { resolvePath, getFileName } from "@foxkit/node-util/path";
import { readdir } from "fs/promises";
import { join } from "path";
import { findDeprecatedComponents } from "../../../src/scripts/utils/svg/findDeprecatedComponents.mjs";

test("finds removed components", async () => {
  const path = resolvePath("src/components/icons/"); // NOTE: change when moving client src
  const dir = await readdir(path);
  const files = dir
    .filter(file => getFileName(file, false) !== "index")
    .map(file => join(path, file));
  const expected = files.slice(0, 1);
  const components = new Set(
    files.slice(1).map(file => getFileName(file, false))
  );
  assert.equal(await findDeprecatedComponents(components), expected);
});

test.run();
