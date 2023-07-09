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

export function upgradeCollectIDs(upgrade: BundledUpgrade) {
  const collection = createCollection();
  collection.quests.add(upgrade.quest);
  collection.servants.add(upgrade.servant);

  switch (upgrade.upgrades?.type) {
    case "np":
      collection.nps.add(upgrade.upgrades.id);
      collection.nps.add(upgrade.upgrades.newId);
      break;
    case "skill":
      collection.skills.add(upgrade.upgrades.id ?? 0);
      collection.skills.add(upgrade.upgrades.newId);
  }

  return collection;
}

export function upgradesCollectIDs(upgrades: BundledUpgrade[]) {
  const collection = createCollection();

  for (const upgrade of upgrades) {
    collection.quests.add(upgrade.quest);
    collection.servants.add(upgrade.servant);

    switch (upgrade.upgrades?.type) {
      case "np":
        collection.nps.add(upgrade.upgrades.id);
        collection.nps.add(upgrade.upgrades.newId);
        break;
      case "skill":
        collection.skills.add(upgrade.upgrades.id ?? 0);
        collection.skills.add(upgrade.upgrades.newId);
    }
  }

  return collection;
}

/**
 * Checks all quests in set for quest unlock condition that require further quests
 * @param set Set of Quest IDs
 */
export async function addQuestUnlockIds(set: Set<number>) {
  const questIds = Array.from(set);

  return Promise.all(
    questIds.map(async id => {
      const quest = await getQuest(id);
      if (!quest) {
        Log.throw(`Could not find quest with id ${id} in bundled data`);
      }

      quest.unlock?.quests?.forEach(unlockId => set.add(unlockId));
    })
  );
}
