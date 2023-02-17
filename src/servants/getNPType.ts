import { Card } from "@atlasacademy/api-connector";
import type { NoblePhantasm } from "@atlasacademy/api-connector/dist/Schema/NoblePhantasm";
import { Log } from "../utils/log";
import type { NPType } from "./types";
import { ServantCard } from "./types";

export function getNPType(np: NoblePhantasm): NPType {
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
