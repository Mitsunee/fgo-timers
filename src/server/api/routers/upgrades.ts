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
import {
  createUpgradeFilter,
  createUpgradeSorter
} from "src/pages/UpgradesPage/filters";
import { formFiltersDefault } from "src/pages/UpgradesPage/filtersReducer";

export type ExpandedUpgrades = Pick<
  StaticBundles,
  "upgrades" | "quests" | "servants" | "skills" | "nps"
>;

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
  const upgrades = [...upgradesList].sort(sorter);
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
    .input(z.object({ id: z.union([z.number(), z.array(z.number())]) }))
    .query(async ({ input }): Promise<ExpandedUpgrades> => {
      const targetIds = new Set(
        Array.isArray(input.id) ? input.id : [input.id]
      );

      const upgradesList = await getBundledUpgrades();
      const upgrades: ExpandedUpgrades["upgrades"] = upgradesList.filter(
        upgrade => targetIds.has(upgrade.quest)
      );

      return expandUpgrades(upgrades);
    }),
  all: publicProcedure.query(async () => {
    const upgrades = await getBundledUpgrades();
    return expandUpgrades(upgrades);
  }),
  ssgFallback: publicProcedure.query(async () => {
    const [upgradesList, questMap, servantMap] = await Promise.all([
      getBundledUpgrades(),
      getBundledQuestMap(),
      getBundledServantMap()
    ]);

    const sorter = createUpgradeSorter(questMap);
    const filter = createUpgradeFilter(
      formFiltersDefault,
      servantMap,
      questMap
    );
    const upgrades = upgradesList.sort(sorter).filter(filter).slice(0, 10);

    return expandUpgrades(upgrades);
  })
});
