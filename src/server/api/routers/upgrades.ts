import { z } from "zod";
import { createUpgradeSorter } from "~/pages/UpgradesPage/filters";
import { createNoblePhantasmRecord } from "~/static/data/noblePhantasms";
import { createQuestRecord } from "~/static/data/quests";
import { createServantRecord } from "~/static/data/servants";
import { createSkillRecord } from "~/static/data/skills";
import { getBundledUpgrades } from "~/static/upgrades";
import { addQuestUnlockIds, upgradesCollectIDs } from "~/upgrades/collectIDs";
import type { WithMaps } from "~/client/contexts";
import type { BundledUpgrade } from "~/upgrades/types";
import { createTRPCRouter, publicProcedure } from "../trpc";

export type ExpandedUpgrades = WithMaps<
  "quests" | "servants" | "skills" | "nps"
> & { upgrades: BundledUpgrade[] };

async function expandUpgrades(
  upgradesList: ExpandedUpgrades["upgrades"]
): Promise<ExpandedUpgrades> {
  const ids = upgradesCollectIDs(upgradesList);
  await addQuestUnlockIds(ids.quests);
  const [quests, servants, skills, nps] = await Promise.all([
    createQuestRecord(ids.quests),
    createServantRecord(ids.servants),
    createSkillRecord(ids.skills),
    createNoblePhantasmRecord(ids.nps)
  ]);
  const sorter = createUpgradeSorter(quests);
  const upgrades = // clone array, don't modify original
    [...upgradesList].sort(sorter);

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
