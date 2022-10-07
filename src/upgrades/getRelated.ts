import { atlasCache } from "../atlas-api/cache";
import type { SupportedRegion } from "../atlas-api/api";
import type { Servant } from "@atlasacademy/api-connector/dist/Schema/Servant";
import type { Skill } from "@atlasacademy/api-connector/dist/Schema/Skill";
import type { NoblePhantasm } from "@atlasacademy/api-connector/dist/Schema/NoblePhantasm";
import { decensorEoRNP } from "./decensorEoRNP";

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
  // TODO: test typechanged NP. Test Emiya and Spishtar to confirm
  // TODO: test EoR-censored NP. Test Tomoe and Wu Zetian to confirm
  const np = servant.noblePhantasms.find(
    np => np.condQuestId == questId && np.priority > 0
  );

  if (np && np.name == "???") {
    return decensorEoRNP(np, servant);
  }

  return np;
}
