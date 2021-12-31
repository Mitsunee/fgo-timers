import { createSpinner } from "nanospinner";
import { sleep } from "foxkit/sleep";
import { log, die } from "@foxkit/node-util/log";
import { readFileJson, writeFile } from "@foxkit/node-util/fs";

import { fetchNiceServant } from "./shared/fetchNiceServant.mjs";
import { findChangedQuests } from "./upgrades/findChangedQuests.mjs";
import { describeUpgrade } from "./upgrades/descriptors/upgrade.mjs";
import { isRoot } from "./shared/isRoot.mjs";
import { arrangeSkills, arrangeNPs } from "./upgrades/arrange.mjs";

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
    log.success(`Data is already up-to-date (total: ${data.length})`);
    process.exit(0);
  }

  const newUpgrades = new Array();

  for (const quest of changedQuests) {
    // atlas api can't handle too many requests in a row
    const spinner = createSpinner(`Fetching data for Quest ${quest}`);

    // describe quest and sleep to a bit to not crash the API
    log(`  ${changeReasons.get(quest)}`);
    spinner.start();
    const upgradeData = await describeUpgrade(quest, niceData, spinner);
    await sleep(250);

    spinner.success();
    newUpgrades.push(upgradeData);
  }

  data = [
    ...data.filter(({ quest }) => !changedQuests.has(quest.id)),
    ...newUpgrades
  ];

  // write file
  await writeFile("assets/data/upgrades/upgrades.json", data, true);
  log.success(
    `Updated data for ${newUpgrades.length} quests (total: ${data.length})`
  );

  // return success
  return 0;
}

// run main, handle exit code
isRoot();
main()
  .then(res => {
    if (res === true) process.exit(0);
    if (typeof res === "number") process.exit(res);
    if (!res) process.exit(1);
    log(res);
    process.exit(1);
  })
  .catch(err => die(err));
