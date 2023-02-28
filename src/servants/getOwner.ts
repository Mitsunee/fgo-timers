import type { SupportedRegion } from "@atlas-api/api";
import type { NoblePhantasm } from "@atlasacademy/api-connector/dist/Schema/NoblePhantasm";
import type { Servant } from "@atlasacademy/api-connector/dist/Schema/Servant";
import type { Skill } from "@atlasacademy/api-connector/dist/Schema/Skill";
import { atlasCache } from "../atlas-api/cache";

/**
 * Finds owner of NoblePhantasm
 * @param subject NP object from API
 * @param region region override (default: JP)
 * @returns Servant or undefined if not found
 */
export async function getNPOwner(
  subject: NoblePhantasm,
  region: SupportedRegion = "JP"
): Promise<Servant | undefined> {
  const niceServant = await atlasCache[region].getNiceServant();

  return niceServant.find(servant =>
    servant.noblePhantasms.some(np => np.id == subject.id)
  );
}

/**
 * Find all owners of Skill
 * @param subject Skill object from API
 * @param region region override (default: JP)
 * @returns Array of Servant
 */
export async function getSkillOwners(
  subject: Skill,
  region: SupportedRegion = "JP"
): Promise<Servant[]> {
  const niceServant = await atlasCache[region].getNiceServant();

  return niceServant.filter(servant =>
    servant.skills.some(skill => skill.id == subject.id)
  );
}
