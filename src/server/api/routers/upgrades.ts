import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import type { StaticBundles } from "src/utils/getBundles";
import {
  getBundledUpgrades,
  getBundledQuestMap,
  getBundledServantMap,
  getBundledSkillMap,
  getBundledNPMap
} from "src/utils/getBundles";
import { createUpgradeSorter } from "src/pages/UpgradesPage/filters";

export type ExpandedUpgrades = Pick<
  StaticBundles,
  "upgrades" | "quests" | "servants" | "skills" | "nps"
>;

/**
 * Force-sets na prop on an entity (Upgrade, Servants, Skills, ...). Do not use on Quests, as those use their NA prop for sorting!
 */
function unSpoilerEntity<T extends { na?: true }>(entity: T): T {
  return {
    ...entity,
    na: true as const
  };
}

async function expandUpgrades(
  upgradesList: ExpandedUpgrades["upgrades"],
  disableSpoilers?: boolean
): Promise<ExpandedUpgrades> {
  const [questMap, servantMap, skillMap, npMap] = await Promise.all([
    getBundledQuestMap(),
    getBundledServantMap(),
    getBundledSkillMap(),
    getBundledNPMap()
  ]);

  const sorter = createUpgradeSorter(questMap);
  const upgrades = (
    disableSpoilers
      ? upgradesList.map(upgrade => unSpoilerEntity(upgrade))
      : // clone array, don't modify original
        [...upgradesList]
  ).sort(sorter);
  const quests: ExpandedUpgrades["quests"] = {};
  const servants: ExpandedUpgrades["servants"] = {};
  const skills: ExpandedUpgrades["skills"] = {};
  const nps: ExpandedUpgrades["nps"] = {};

  for (const upgrade of upgrades) {
    // map quest and its unlock requirement quest(s)
    const quest = (quests[upgrade.quest] ??= questMap[upgrade.quest]);
    quest.unlock?.quests?.forEach(id => (quests[id] ??= questMap[id]));

    // map servant
    servants[upgrade.servant] ??= disableSpoilers
      ? unSpoilerEntity(servantMap[upgrade.servant])
      : servantMap[upgrade.servant];

    // map upgrade targets
    if (upgrade.upgrades) {
      if (upgrade.upgrades.type == "skill") {
        const { id = 0, newId } = upgrade.upgrades;
        skills[id] ??= disableSpoilers
          ? unSpoilerEntity(skillMap[id])
          : skillMap[id];
        skills[newId] ??= disableSpoilers
          ? unSpoilerEntity(skillMap[newId])
          : skillMap[newId];
      } else {
        const { id, newId } = upgrade.upgrades;
        nps[id] ??= disableSpoilers ? unSpoilerEntity(npMap[id]) : npMap[id];
        nps[newId] ??= disableSpoilers
          ? unSpoilerEntity(npMap[newId])
          : npMap[newId];
      }
    }
  }

  return { upgrades, quests, servants, skills, nps };
}

export const upgradesRouter = createTRPCRouter({
  select: publicProcedure
    .input(
      z.object({
        id: z.union([z.number(), z.array(z.number())]),
        disableSpoilers: z.boolean().optional() // TEMP
        // TODO: prop to override quest open dates? Probably a z.record(z.number(),z.number())?
      })
    )
    .query(async ({ input }): Promise<ExpandedUpgrades> => {
      const { id, disableSpoilers = false } = input;
      const targetIds = new Set(Array.isArray(id) ? id : [id]);

      const upgradesList = await getBundledUpgrades();
      const upgrades: ExpandedUpgrades["upgrades"] = upgradesList.filter(
        upgrade => targetIds.has(upgrade.quest)
      );

      return expandUpgrades(upgrades, disableSpoilers);
    }),
  all: publicProcedure.query(async () => {
    const upgrades = await getBundledUpgrades();
    return expandUpgrades(upgrades);
  })
});
