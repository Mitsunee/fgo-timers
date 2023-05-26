import { z } from "zod";
import { createUpgradeSorter } from "~/pages/UpgradesPage/filters";
import {
  getBundledNPMap,
  getBundledQuestMap,
  getBundledServantMap,
  getBundledSkillMap,
  getBundledUpgrades
} from "~/utils/getBundles";
import type { WithMaps } from "~/client/contexts";
import type { BundledUpgrade } from "~/upgrades/types";
import { createTRPCRouter, publicProcedure } from "../trpc";

export type ExpandedUpgrades = WithMaps<
  "quests" | "servants" | "skills" | "nps"
> & { upgrades: BundledUpgrade[] };

async function expandUpgrades(
  upgradesList: ExpandedUpgrades["upgrades"]
): Promise<ExpandedUpgrades> {
  const [questMap, servantMap, skillMap, npMap] = await Promise.all([
    getBundledQuestMap(),
    getBundledServantMap(),
    getBundledSkillMap(),
    getBundledNPMap()
  ]);

  const sorter = createUpgradeSorter(questMap);
  const upgrades = // clone array, don't modify original
    [...upgradesList].sort(sorter);
  const quests: ExpandedUpgrades["quests"] = {};
  const servants: ExpandedUpgrades["servants"] = {};
  const skills: ExpandedUpgrades["skills"] = {};
  const nps: ExpandedUpgrades["nps"] = {};

  for (const upgrade of upgrades) {
    // map quest and its unlock requirement quest(s)
    const quest = (quests[upgrade.quest] ??= questMap[upgrade.quest]);
    quest.unlock?.quests?.forEach(id => (quests[id] ??= questMap[id]));

    // map servant
    servants[upgrade.servant] ??= servantMap[upgrade.servant];

    // map upgrade targets
    if (upgrade.upgrades) {
      if (upgrade.upgrades.type == "skill") {
        const { id = 0, newId } = upgrade.upgrades;
        skills[id] ??= skillMap[id];
        skills[newId] ??= skillMap[newId];
      } else {
        const { id, newId } = upgrade.upgrades;
        nps[id] ??= npMap[id];
        nps[newId] ??= npMap[newId];
      }
    }
  }

  return { upgrades, quests, servants, skills, nps };
}

export const upgradesRouter = createTRPCRouter({
  select: publicProcedure
    .input(
      z.object({
        id: z.union([z.number(), z.array(z.number())])
      })
    )
    .query(async ({ input }): Promise<ExpandedUpgrades> => {
      const { id } = input;
      const targetIds = new Set(Array.isArray(id) ? id : [id]);

      const upgradesList = await getBundledUpgrades();
      const upgrades: ExpandedUpgrades["upgrades"] = upgradesList.filter(
        upgrade => targetIds.has(upgrade.quest)
      );

      return expandUpgrades(upgrades);
    }),
  all: publicProcedure.query(async () => {
    const upgrades = await getBundledUpgrades();
    return expandUpgrades(upgrades);
  })
});
