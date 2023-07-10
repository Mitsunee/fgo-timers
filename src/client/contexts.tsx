import { useMemo } from "react";
import { createContext, useContextSelector } from "use-context-selector";
import type {
  BundledCommandCode,
  BundledCostume,
  BundledCraftEssence,
  BundledItem,
  BundledMysticCode
} from "~/items/types";
import type {
  BundledNoblePhantasm,
  BundledServant,
  BundledSkill
} from "~/servants/types";
import type { BundledQuest } from "~/upgrades/types";

interface Maps {
  servants: DataMap<BundledServant>;
  skills: DataMap<BundledSkill>;
  nps: DataMap<BundledNoblePhantasm>;
  quests: DataMap<BundledQuest>;
  ces: DataMap<BundledCraftEssence>;
  items: DataMap<BundledItem>;
  ccs: DataMap<BundledCommandCode>;
  mcs: DataMap<BundledMysticCode>;
  costumes: DataMap<BundledCostume>;
}

export type WithMaps<Keys extends keyof Maps> = Pick<Maps, Keys>;

const dataContext = createContext<Partial<Maps>>({});
type DataContextProps = Partial<Maps> & React.PropsWithChildren;
export function DataContext({
  children,
  servants,
  skills,
  nps,
  quests,
  ces,
  items,
  ccs,
  mcs,
  costumes
}: DataContextProps) {
  const value = useMemo(() => {
    return {
      servants,
      skills,
      nps,
      quests,
      ces,
      items,
      ccs,
      mcs,
      costumes
    };
  }, [servants, skills, nps, quests, ces, items, ccs, mcs, costumes]);
  return <dataContext.Provider value={value}>{children}</dataContext.Provider>;
}

function useDataContext<Key extends keyof Maps>(key: Key): Maps[Key] {
  const data = useContextSelector(dataContext, ctx => ctx[key]);
  if (!data) {
    throw new Error(`Missing Context: ${key}`);
  }
  return data;
}

export const useServantMap = () => useDataContext("servants");
export const useSkillMap = () => useDataContext("skills");
export const useNPMap = () => useDataContext("nps");
export const useQuestMap = () => useDataContext("quests");
export const useCEMap = () => useDataContext("ces");
export const useItemMap = () => useDataContext("items");
export const useCCMap = () => useDataContext("ccs");
export const useMysticCodeMap = () => useDataContext("mcs");
export const useCostumeMap = () => useDataContext("costumes");
