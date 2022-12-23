import type { NoblePhantasm } from "@atlasacademy/api-connector/dist/Schema/NoblePhantasm";
import type { Servant } from "@atlasacademy/api-connector/dist/Schema/Servant";

export function findEoRNPName(np: NoblePhantasm, servant: Servant): string {
  if (np.name !== "???") return np.name;
  const realname = servant.noblePhantasms
    .filter(({ name, strengthStatus }) => {
      return name !== "???" && strengthStatus == np.strengthStatus;
    })
    .sort((a, b) => b.priority - a.priority)
    .at(0)?.name;

  if (!realname) {
    throw new Error(
      `Could not decensor NP id ${np.id} for servant [${servant.id}] ${servant.name}`
    );
  }

  return realname;
}
