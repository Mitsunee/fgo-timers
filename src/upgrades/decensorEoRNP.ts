import type { NoblePhantasm } from "@atlasacademy/api-connector/dist/Schema/NoblePhantasm";
import type { Servant } from "@atlasacademy/api-connector/dist/Schema/Servant";

export function decensorEoRNP(
  np: NoblePhantasm,
  servant: Servant
): NoblePhantasm {
  if (np.name !== "???") return np;
  const realname = servant.noblePhantasms
    .filter(_np => {
      return _np.name !== "???" && _np.strengthStatus == np.strengthStatus;
    })
    .sort((a, b) => b.priority - a.priority)
    .at(0)?.name;

  if (!realname) {
    throw new Error(
      `Could not decensor NP id ${np.id} for servant [${servant.id}] ${servant.name}`
    );
  }

  return {
    ...np,
    name: realname
  };
}
