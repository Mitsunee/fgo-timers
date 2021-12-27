import spacetime from "spacetime";
import { readFileJson, writeFile } from "./shared/fs-helper.mjs";
import { log } from "./shared/log.mjs";
import { fetchData } from "./shared/fetchData.mjs";
import { updateCache } from "./cache-atlas/updateCache.mjs";
import { isRoot } from "./shared/isRoot.mjs";

async function main(args) {
  const force = args.includes("-f") || args.includes("--force");
  const today = spacetime.now().startOf("day").epoch;
  const cacheInfo = await readFileJson("cache/info.json");

  if (!force && today === cacheInfo?.age) {
    log.success("Cache was checked today");
    return;
  }
  const apiInfo = await fetchData("https://api.atlasacademy.io/info");

  if (
    !force &&
    apiInfo.NA.hash === cacheInfo?.hashNA &&
    apiInfo.JP.hash === cacheInfo?.hashJP
  ) {
    log.success("Cache already up-to-date");
  }

  if (force || apiInfo.NA.hash !== cacheInfo?.hashNA) {
    await updateCache("NA/nice_servant.json");
    await updateCache("NA/nice_item.json");
    //await updateCache("NA/nice_equip.json");
    log.success("Updated NA Cache");
  }

  if (force || apiInfo.JP.hash !== cacheInfo?.hashJP) {
    await updateCache("JP/nice_servant_lang_en.json");
    await updateCache("JP/nice_item_lang_en.json");
    //await updateCache("JP/nice_equip_lang_en.json");
    log.success("Updated JP Cache");
  }

  await writeFile("cache/info.json", {
    age: today,
    hashNA: apiInfo.NA.hash,
    hashJP: apiInfo.JP.hash
  });
}

isRoot();
main(process.argv.slice(2));
