import type { NoblePhantasm } from "@atlasacademy/api-connector/dist/Schema/NoblePhantasm";
import type { Servant } from "@atlasacademy/api-connector/dist/Schema/Servant";
import type { Skill } from "@atlasacademy/api-connector/dist/Schema/Skill";
import { getNiceServantsFull } from "~/atlas-api/cache/data/niceServant";
import type { SupportedRegion } from "~/atlas-api/api";

export async function getRelatedServant(
  questId: number,
  region: SupportedRegion
): Promise<Servant | undefined> {
  const niceServant = await getNiceServantsFull(region);
  return niceServant.find(servant => servant.relateQuestIds.includes(questId));
}

export function getRelatedSkill(
  servant: Servant,
  questId: number
): Skill | undefined {
  return servant.skills.find(skill => skill.condQuestId == questId);
}

export function getRelatedNP(
  servant: Servant,
  questId: number
): NoblePhantasm | undefined {
  const np = servant.noblePhantasms.find(
    np => np.condQuestId == questId && np.priority > 0
  );

  return np;
}
