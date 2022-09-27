import { sleep } from "foxkit/sleep";
import { readFileJson, writeFile } from "@foxkit/node-util/fs";

import { prepareCache } from "@atlas-api/prepare.ts";
import * as log from "../utils/log.mjs";
import { die } from "./die.mjs";
import { fetchNiceServant } from "./fetchNiceServant.mjs";
import { findChangedQuests } from "./findChangedQuests.mjs";
import { describeUpgrade } from "./descriptors/upgrade.mjs";
import { arrangeSkills, arrangeNPs } from "./arrange.mjs";

// TODO: figure out a workaround for EoR skills

async function main() {
  // read existing data
  let data = [];
  try {
    data = await readFileJson("assets/data/upgrades/upgrades.json");
  } catch (err) {
    log.warn(err);
  }

  // fetch nice servant data and rearrange for describeUpgrade
  await prepareCache();
  const niceServant = await fetchNiceServant();
  const niceData = {
    skills: arrangeSkills(niceServant),
    nps: arrangeNPs(niceServant),
    servants: {
      jp: niceServant.jp,
      na: niceServant.na
    }
  };

  // compare quest IDs to find any that changed
  const { changedQuests, changeReasons } = findChangedQuests(data, niceServant);

  // if nothing changed quit with success
  if (changedQuests.size === 0) {
    log.info(`Data is already up-to-date (total: ${data.length})`);
    process.exit(0);
  }

  const newUpgrades = new Array();

  for (const quest of changedQuests) {
    // describe quest and sleep to a bit to not crash the API
    log.info(`  ${changeReasons.get(quest)}`);
    const upgradeData = await describeUpgrade(quest, niceData);
    await sleep(250);

    newUpgrades.push(upgradeData);
  }

  data = [
    ...data.filter(({ quest }) => !changedQuests.has(quest.id)),
    ...newUpgrades
  ];

  // write file
  await writeFile("assets/data/upgrades/upgrades.json", data, true);
  log.ready(
    `Updated data for ${newUpgrades.length} quests (total: ${data.length})`
  );

  // return success
  return 0;
}

// run main, handle exit code
main()
  .then(res => {
    if (res === true) process.exit(0);
    if (typeof res === "number") process.exit(res);
    if (!res) process.exit(1);
    log.log(res);
    process.exit(1);
  })
  .catch(err => die(err));
