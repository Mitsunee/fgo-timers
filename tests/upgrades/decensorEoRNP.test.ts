import { atlasCache } from "src/atlas-api/cache";
import { Servant } from "@atlasacademy/api-connector/dist/Schema/Servant";
import { decensorEoRNP } from "src/upgrades/decensorEoRNP";

let eorServants: { NA: Servant[]; JP: Servant[] };

beforeAll(async () => {
  const [niceServant, niceServantNA] = await Promise.all([
    atlasCache.JP.getNiceServant(),
    atlasCache.NA.getNiceServant()
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

describe("decensorEoRNP", () => {
  it("decensors all EoR NPs for JP", () => {
    for (const servant of eorServants.JP) {
      const censoredNPs = servant.noblePhantasms.filter(np => np.name == "???");
      for (const censoredNP of censoredNPs) {
        const uncensoredNP = decensorEoRNP(censoredNP, servant);
        expect(uncensoredNP).toBeDefined();
        expect(uncensoredNP.name).toBeDefined();
        expect(uncensoredNP.name).not.toBe("???");
        expect(uncensoredNP.id).toBe(censoredNP.id);
      }
    }
  });
  it("decensors all EoR NPs for NA", () => {
    for (const servant of eorServants.NA) {
      const censoredNPs = servant.noblePhantasms.filter(np => np.name == "???");
      for (const censoredNP of censoredNPs) {
        const uncensoredNP = decensorEoRNP(censoredNP, servant);
        expect(uncensoredNP).toBeDefined();
        expect(uncensoredNP.name).toBeDefined();
        expect(uncensoredNP.name).not.toBe("???");
        expect(uncensoredNP.id).toBe(censoredNP.id);
      }
    }
  });
});
