import type { NoblePhantasm } from "@atlasacademy/api-connector/dist/Schema/NoblePhantasm";
import type { Servant } from "@atlasacademy/api-connector/dist/Schema/Servant";
import type { Skill } from "@atlasacademy/api-connector/dist/Schema/Skill";
import { isSkill } from "~/servants/types";

export function getUpgradeLevel(
  servant: Servant,
  subject: Skill | NoblePhantasm
): number {
  // NOTE: Melusine and Mash are currently unsupported.
  if (servant.id == 304800 || servant.id == 800100) {
    throw new Error("Melusine and Mash are currently unsupported");
  }

  // handle Skill
  if (isSkill(subject)) {
    const relatedSkills = servant.skills
      .filter(skill => skill.num == subject.num) // only skills in the same slot
      .sort((a, b) => a.id - b.id);
    return relatedSkills.findIndex(skill => skill.id == subject.id);
  }

  // handle NP
  const relatedNPs = servant.noblePhantasms
    .filter(np => np.priority > 0) // priority 0 are type changed NPs
    .filter(np => {
      // "???" are EoR-censored
      if (subject.name == "???") {
        // if subject is EoR NP, only return those
        return np.name == "???";
      }
      // otherwise filter out EoR NPs
      return np.name !== "???";
    })
    .sort((a, b) => a.id - b.id);
  return relatedNPs.findIndex(np => np.id == subject.id);
}
