import type { NoblePhantasm } from "@atlasacademy/api-connector/dist/Schema/NoblePhantasm";
import type { Servant } from "@atlasacademy/api-connector/dist/Schema/Servant";
import type { Skill } from "@atlasacademy/api-connector/dist/Schema/Skill";
import { atlasCacheJP } from "../atlas-api/cache";
import { isSkill } from "./types";

export async function getOwner(
  subject: Skill | NoblePhantasm
): Promise<Servant | undefined> {
  const niceServant = await atlasCacheJP.getNiceServant();

  return niceServant.find(
    isSkill(subject)
      ? servant => servant.skills.some(skill => skill.id == subject.id)
      : servant => servant.noblePhantasms.some(np => np.id == subject.id)
  );
}
