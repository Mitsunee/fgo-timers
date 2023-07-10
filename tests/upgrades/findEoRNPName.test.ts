import type { Servant } from "@atlasacademy/api-connector/dist/Schema/Servant";
import { getNiceServantsFull } from "~/atlas-api/cache/data/niceServant";
import { findEoRNPName } from "~/upgrades/findEoRNPName";

let eorServants: { NA: Servant[]; JP: Servant[] };

beforeAll(async () => {
  const [niceServant, niceServantNA] = await Promise.all([
    getNiceServantsFull("JP"),
    getNiceServantsFull("NA")
  ]);
  const JP = niceServant.filter(servant =>
    servant.noblePhantasms.some(np => np.name == "???")
  );
  const NA = niceServantNA.filter(servant =>
    servant.noblePhantasms.some(np => np.name == "???")
  );
  eorServants = { JP, NA };

  if (!eorServants.JP.length) {
    throw new Error("Could not find EoR servants for region JP");
  }

  if (!eorServants.NA.length) {
    throw new Error("Could not find EoR servants for region NA");
  }
});

describe("findEoRNPName", () => {
  it("decensors all EoR NPs for JP", () => {
    for (const servant of eorServants.JP) {
      const censoredNPs = servant.noblePhantasms.filter(np => np.name == "???");
      for (const censoredNP of censoredNPs) {
        const uncensoredNP = findEoRNPName(censoredNP, servant);
        expect(uncensoredNP).toBeDefined();
        expect(uncensoredNP).not.toBe("???");
      }
    }
  });
  it("decensors all EoR NPs for NA", () => {
    for (const servant of eorServants.NA) {
      const censoredNPs = servant.noblePhantasms.filter(np => np.name == "???");
      for (const censoredNP of censoredNPs) {
        const uncensoredNP = findEoRNPName(censoredNP, servant);
        expect(uncensoredNP).toBeDefined();
        expect(uncensoredNP).not.toBe("???");
      }
    }
  });
});
