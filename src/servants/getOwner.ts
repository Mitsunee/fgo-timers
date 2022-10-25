import { SupportedRegion } from "@atlas-api/api";
import type { NoblePhantasm } from "@atlasacademy/api-connector/dist/Schema/NoblePhantasm";
import type { Servant } from "@atlasacademy/api-connector/dist/Schema/Servant";
import type { Skill } from "@atlasacademy/api-connector/dist/Schema/Skill";
import { atlasCache } from "../atlas-api/cache";

export async function getNPOwner(
  subject: NoblePhantasm,
  region: SupportedRegion = "JP"
): Promise<Servant | undefined> {
  const niceServant = await atlasCache[region].getNiceServant();

  return niceServant.find(servant =>
    servant.noblePhantasms.some(np => np.id == subject.id)
  );
}

export async function getSkillOwners(
  subject: Skill,
  region: SupportedRegion = "JP"
): Promise<Servant[]> {
  const niceServant = await atlasCache[region].getNiceServant();

  return niceServant.filter(servant =>
    servant.skills.some(skill => skill.id == subject.id)
  );
}
