import { getQuest } from "~/static/data/quests";
import { Log } from "~/utils/log";
import type { IDCollection } from "~/prebuild/utils/collectIds";
import type { BundledUpgrade } from "./types";

type UpgradeIDCollection = Pick<
  IDCollection,
  "servants" | "quests" | "skills" | "nps"
>;

function createCollection() {
  const ids: UpgradeIDCollection = {
    servants: new Set(),
    quests: new Set(),
    skills: new Set(),
    nps: new Set()
  };
  return ids;
}

export async function upgradeCollectIDs(upgrade: BundledUpgrade) {
  const collection = createCollection();
  collection.quests.add(upgrade.quest);
  collection.servants.add(upgrade.servant);
  const quest = await getQuest(upgrade.quest);
  if (!quest) {
    Log.throw(`Could not find quest with id ${upgrade.quest} in bundled data`);
  }

  quest.unlock?.quests?.forEach(id => collection.quests.add(id));

  switch (upgrade.upgrades?.type) {
    case "np":
      collection.nps.add(upgrade.upgrades.id);
      collection.nps.add(upgrade.upgrades.newId);
      break;
    case "skill": {
      const id = upgrade.upgrades.id ?? 0; // add placeholder skill if not set
      collection.skills.add(id);
      collection.skills.add(upgrade.upgrades.newId);
    }
  }

  return collection;
}

export async function upgradesCollectIDs(upgrades: BundledUpgrade[]) {
  const collection = createCollection();

  await Promise.all(
    upgrades.map(async upgrade => {
      collection.quests.add(upgrade.quest);
      collection.servants.add(upgrade.servant);
      const quest = await getQuest(upgrade.quest);
      if (!quest) {
        Log.throw(
          `Could not find quest with id ${upgrade.quest} in bundled data`
        );
      }

      quest.unlock?.quests?.forEach(id => collection.quests.add(id));

      switch (upgrade.upgrades?.type) {
        case "np":
          collection.nps.add(upgrade.upgrades.id);
          collection.nps.add(upgrade.upgrades.newId);
          break;
        case "skill":
          if (typeof upgrade.upgrades.id == "number") {
            collection.skills.add(upgrade.upgrades.id);
          }
          collection.skills.add(upgrade.upgrades.newId);
      }
    })
  );

  return collection;
}
