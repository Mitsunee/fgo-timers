import type { PrebuildBundle } from "./bundlers";

interface IDCollection {
  servants: Set<number>;
  quests: Set<number>;
  skills: Set<number>;
  nps: Set<number>;
  ces: Set<number>;
  items: Set<number>;
  ccs: Set<number>;
  mcs: Set<number>;
  costumes: Set<number>;
}

export function collectIDs(bundles: PrebuildBundle<any>[]) {
  const collection: IDCollection = {
    servants: new Set(),
    quests: new Set(),
    skills: new Set(),
    nps: new Set(),
    ces: new Set(),
    items: new Set(),
    ccs: new Set(),
    mcs: new Set(),
    costumes: new Set()
  };

  bundles.forEach(bundle => {
    bundle.servants?.forEach(id => collection.servants.add(id));
    bundle.quests?.forEach(id => collection.quests.add(id));
    bundle.skills?.forEach(id => collection.skills.add(id));
    bundle.nps?.forEach(id => collection.nps.add(id));
    bundle.ces?.forEach(id => collection.ces.add(id));
    bundle.items?.forEach(id => collection.items.add(id));
    bundle.ccs?.forEach(id => collection.ccs.add(id));
    bundle.mcs?.forEach(id => collection.mcs.add(id));
    bundle.costumes?.forEach(id => collection.costumes.add(id));
  });

  return collection;
}
