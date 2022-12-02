import type { GetStaticProps } from "next";

import {
  getBundledNPs,
  getBundledServants,
  getBundledSkills
} from "src/servants/getBundles";
import { getBundledQuests, getBundledUpgrades } from "src/upgrades/getBundles";
import type { QuestUpgrade } from "src/upgrades/types";
import { JP_TO_NA_ESTIMATE } from "src/types/constants";
import { Log } from "src/utils/log";
import { DataApiFallback, UpgradesPageData } from "src/server/DataApi";

const apiUrl = "/api/data/upgrades" as const;
type UpgradesPageProps = DataApiFallback<typeof apiUrl, UpgradesPageData>;

export const getStaticProps: GetStaticProps<UpgradesPageProps> = async () => {
  const [upgrades, quests, servants, nps, skills] = await Promise.all([
    getBundledUpgrades(),
    getBundledQuests(),
    getBundledServants(),
    getBundledNPs(),
    getBundledSkills()
  ]);

  upgrades.sort((upgradeA, upgradeB) => {
    const questA = quests[upgradeA.quest] as QuestUpgrade;
    const questB = quests[upgradeB.quest] as QuestUpgrade;
    const offset =
      (upgradeA.na ? 0 : JP_TO_NA_ESTIMATE) -
      (upgradeB.na ? 0 : JP_TO_NA_ESTIMATE);

    return questA.open - questB.open + offset;
  });

  const prebuiltSlice = upgrades.filter(upgrade => upgrade.na).slice(0, 10);
  const includedServants = new Set<number>();
  const includedQuests = new Set<number>();
  const includedSkills = new Set<number>();
  const includedNPs = new Set<number>();

  for (const upgrade of prebuiltSlice) {
    includedServants.add(upgrade.servant);
    includedQuests.add(upgrade.quest);
    const quest = quests[upgrade.quest];
    if (!quest) {
      Log.error(`Could not find quest id ${upgrade.quest} in prebuild data`);
      throw new Error("Invalid data");
    }
    quest.unlock?.quests?.forEach(quest => includedQuests.add(quest));
    if (upgrade.upgrades) {
      if (upgrade.upgrades.type == "skill") {
        if (upgrade.upgrades.id) includedSkills.add(upgrade.upgrades.id);
        includedSkills.add(upgrade.upgrades.newId);
      } else {
        includedNPs.add(upgrade.upgrades.id);
        includedNPs.add(upgrade.upgrades.newId);
      }
    }
  }

  return {
    props: {
      fallback: {
        [apiUrl]: {
          upgrades: prebuiltSlice,
          servants: Object.fromEntries(
            Array.from(includedServants, servantId => {
              const servant = servants[servantId];
              if (!servant) {
                Log.error(
                  `Could not find servant id ${servantId} in prebuild data`
                );
                throw new Error("Invalid data");
              }
              return [servantId, servant];
            })
          ),
          quests: Object.fromEntries(
            Array.from(includedQuests, questId => {
              const quest = quests[questId];
              if (!quest) {
                Log.error(
                  `Could not find quest id ${questId} in prebuild data`
                );
                throw new Error("Invalid data");
              }
              return [questId, quest];
            })
          ),
          skills: Object.fromEntries(
            Array.from(includedSkills, skillId => {
              const skill = skills[skillId];
              if (!skill) {
                Log.error(
                  `Could not find skill id ${skillId} in prebuild data`
                );
                throw new Error("Invalid data");
              }
              return [skillId, skill];
            })
          ),
          nps: Object.fromEntries(
            Array.from(includedNPs, npId => {
              const np = nps[npId];
              if (!np) {
                Log.error(`Could not find NP id ${npId} in prebuild data`);
                throw new Error("Invalid data");
              }
              return [npId, np];
            })
          )
        }
      }
    }
  };
};
