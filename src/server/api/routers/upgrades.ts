import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import type { StaticBundles } from "../utils/getBundle";
import { getBundle } from "../utils/getBundle";

type ExpandedUpgrades = Pick<
  StaticBundles,
  "upgrades" | "quests" | "servants" | "skills" | "nps"
>;

// TODO: sort upgrades
async function expandUpgrades(
  upgrades: ExpandedUpgrades["upgrades"]
): Promise<ExpandedUpgrades> {
  const [questMap, servantMap, skillMap, npMap] = await Promise.all([
    getBundle.quests(),
    getBundle.servants(),
    getBundle.skills(),
    getBundle.nps()
  ]);

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
        const { id, newId } = upgrade.upgrades;
        if (id) skills[id] ??= skillMap[id];
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

      const upgradesList = await getBundle.upgrades();
      const upgrades: ExpandedUpgrades["upgrades"] = upgradesList.filter(
        upgrade => targetIds.has(upgrade.quest)
      );

      return expandUpgrades(upgrades);
    }),
  all: publicProcedure.query(async () => {
    const upgrades = await getBundle.upgrades();
    return expandUpgrades(upgrades);
  })
});
