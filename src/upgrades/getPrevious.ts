import type { NoblePhantasm } from "@atlasacademy/api-connector/dist/Schema/NoblePhantasm";
import type { Servant } from "@atlasacademy/api-connector/dist/Schema/Servant";
import type { Skill } from "@atlasacademy/api-connector/dist/Schema/Skill";

export function getPreviousSkill(
  servant: Servant,
  subject: Skill
): Skill | undefined {
  return servant.skills
    .filter(skill => skill.num == subject.num && skill.id < subject.id)
    .sort((a, b) => b.id - a.id)
    .at(0);
}

export function getPreviousNP(
  servant: Servant,
  subject: NoblePhantasm
): NoblePhantasm {
  const nps = servant.noblePhantasms
    .filter(np => np.priority > 0 && np.id < subject.id)
    .sort((a, b) => b.id - a.id);

  if (!nps.length) {
    throw new Error(
      `Could not find previous NP for id ${subject.id} for servant [${servant.id}] ${servant.name}`
    );
  }

  // find censored EoR NP if possible. This is needed as other utils will
  // find that NP's id and we want to use the same one to avoid duplicated
  // NPs in the cache and build output
  const { strengthStatus } = nps[0];
  const eor = nps.find(
    np => np.strengthStatus == strengthStatus && np.name == "???"
  );

  return eor ?? nps[0];
}
