import type { Servant } from "@atlasacademy/api-connector/dist/Schema/Servant";
import type { Quest } from "@atlasacademy/api-connector/dist/Schema/Quest";
import { getQuestData } from "src/upgrades/getQuestData";
import { atlasCacheNA } from "src/atlas-api/cache";
import { getRelatedServant } from "src/upgrades/getRelatedServant";

let servant: Servant;
let quests: Quest[];

beforeAll(async () => {
  const niceServant = await atlasCacheNA.getNiceServant();
  servant = niceServant.find(servant => servant.id === 103000)!; // Suzuka Gozen
  const res = await Promise.all([
    getQuestData(servant.relateQuestIds[0], "NA"), // quest related to Suzuka Gozen
    getQuestData(1000011, "NA") // Grand Order main quest (expected to be unrelated to any servant)
  ]);
  if (res.some(quest => !quest)) throw new Error("Invalid test data");
  quests = res as Quest[];
});

describe("getRelatedServant", () => {
  it("maps servant when available", () => {
    expect(getRelatedServant(quests[0].id, "NA")).resolves.toEqual(servant);
  });
  it("returns undefined when not available", () => {
    expect(getRelatedServant(quests[1].id, "NA")).resolves.toBe(undefined);
  });
});
