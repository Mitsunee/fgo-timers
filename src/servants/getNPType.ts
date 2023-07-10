import { Card } from "@atlasacademy/api-connector";
import type { NoblePhantasm } from "@atlasacademy/api-connector/dist/Schema/NoblePhantasm";
import { Log } from "~/utils/log";
import { ServantCard } from "./types";
import type { NoblePhantasmType } from "./types";

/**
 * Gets NP type and maps as ServantCard enum value
 * @param np NP object from API
 * @returns ServantCard enum value
 */
export function getNPType(np: NoblePhantasm): NoblePhantasmType {
  switch (np.card) {
    case Card.BUSTER:
      return ServantCard.BUSTER;
    case Card.ARTS:
      return ServantCard.ARTS;
    case Card.QUICK:
      return ServantCard.QUICK;
    default:
      Log.warn(`Could not map card type for NP id ${np.id}`);
      return ServantCard.QUICK;
  }
}
