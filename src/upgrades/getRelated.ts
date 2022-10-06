import { atlasCache } from "../atlas-api/cache";
import type { SupportedRegion } from "../atlas-api/api";
import type { Servant } from "@atlasacademy/api-connector/dist/Schema/Servant";
import type { Skill } from "@atlasacademy/api-connector/dist/Schema/Skill";
import type { NoblePhantasm } from "@atlasacademy/api-connector/dist/Schema/NoblePhantasm";

export async function getRelatedServant(
  questId: number,
  region: SupportedRegion
): Promise<Servant | undefined> {
  const niceServant = await atlasCache[region].getNiceServant();
  return niceServant.find(servant => servant.relateQuestIds.includes(questId));
}

export async function getRelatedSkill(
  servantId: number,
  questId: number,
  region: SupportedRegion
): Promise<Skill | undefined> {
  const niceServant = await atlasCache[region].getNiceServant();
  const servant = niceServant.find(servant => servant.id == servantId);
  if (!servant) return;
  return servant.skills.find(skill => skill.condQuestId == questId);
}

export async function getRelatedNP(
  servantId: number,
  questId: number,
  region: SupportedRegion
): Promise<NoblePhantasm | undefined> {
  const niceServant = await atlasCache[region].getNiceServant();
  const servant = niceServant.find(servant => servant.id == servantId);
  if (!servant) return;
  // BUG: could possibly return typechanged NP. Test Emiya and Spishtar to confirm
  // BUG: could possibly return EoR-censored NP. Test Tomoe and Wu Zetian to confirm
  return servant.noblePhantasms.find(np => np.condQuestId == questId);
}
