import type { GetStaticProps } from "next";

import {
  getBundledNPs,
  getBundledServants,
  getBundledSkills
} from "src/servants/getBundles";
import { getBundledQuests, getBundledUpgrades } from "src/upgrades/getBundles";
import { DataApiFallback, UpgradesPageData } from "src/server/DataApi";
import { createUpgradeFilter, createUpgradeSorter } from "./filters";
import { safeProxyIDMap } from "src/utils/proxyIDMap";
import { apiUrl } from "./constants";
import { formFiltersDefault } from "./FiltersForm";

type UpgradesPageProps = DataApiFallback<typeof apiUrl, UpgradesPageData>;

export const getStaticProps: GetStaticProps<UpgradesPageProps> = async () => {
  const [upgrades, quests, servants, nps, skills] = await Promise.all([
    getBundledUpgrades(),
    getBundledQuests(),
    getBundledServants(),
    getBundledNPs(),
    getBundledSkills()
  ]);

  // create safe proxy maps for data
  const questMap = safeProxyIDMap(
    quests,
    "Could not find quest id %KEY% in prebuild data"
  );
  const servantMap = safeProxyIDMap(
    servants,
    "Could not find servant id %KEY% in prebuild data"
  );
  const npMap = safeProxyIDMap(
    nps,
    "Could not find NP id %KEY% in prebuild data"
  );
  const skillMap = safeProxyIDMap(
    skills,
    "Could not find skill %KEY% in prebuild data"
  );

  // sort and filter upgrades
  const sorter = createUpgradeSorter(questMap);
  const filter = createUpgradeFilter(formFiltersDefault, servantMap, questMap);
  const prebuiltSlice = upgrades.sort(sorter).filter(filter).slice(0, 10);

  // collect IDs to include
  const includedServants = new Set<number>();
  const includedQuests = new Set<number>();
  const includedSkills = new Set<number>();
  const includedNPs = new Set<number>();

  for (const upgrade of prebuiltSlice) {
    includedServants.add(upgrade.servant);
    includedQuests.add(upgrade.quest);
    const quest = questMap[upgrade.quest];
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
              const servant = servantMap[servantId];
              return [servantId, servant];
            })
          ),
          quests: Object.fromEntries(
            Array.from(includedQuests, questId => {
              const quest = questMap[questId];
              return [questId, quest];
            })
          ),
          skills: Object.fromEntries(
            Array.from(includedSkills, skillId => {
              const skill = skillMap[skillId];
              return [skillId, skill];
            })
          ),
          nps: Object.fromEntries(
            Array.from(includedNPs, npId => {
              const np = npMap[npId];
              return [npId, np];
            })
          )
        }
      }
    }
  };
};
