import type { Servant } from "@atlasacademy/api-connector/dist/Schema/Servant";
import type { Quest } from "@atlasacademy/api-connector/dist/Schema/Quest";
import { getQuestData } from "src/upgrades/getQuestData";
import { atlasCacheNA } from "src/atlas-api/cache";
import {
  getRelatedServant,
  getRelatedSkill,
  getRelatedNP
} from "src/upgrades/getRelated";

let servant: Servant;
let quests: Quest[];

beforeAll(async () => {
  const niceServant = await atlasCacheNA.getNiceServant();
  servant = niceServant.find(servant => servant.id === 103000)!; // Suzuka Gozen
  const res = await Promise.all([
    getQuestData(91103002, "NA"), // 0 - Quest related to Suzuka Gozen that upgrades a Skill
    getQuestData(94051272, "NA"), // 1 - Quest related to Suzuka Gozen that upgrades her NP
    getQuestData(1000011, "NA") // 2 - Grand Order main quest (expected to be unrelated to any servant)
  ]);
  if (res.some(quest => !quest)) throw new Error("Invalid test data");
  quests = res as Quest[];
});

describe("getRelatedServant", () => {
  it("maps servant when available", () => {
    expect(getRelatedServant(quests[0].id, "NA")).resolves.toEqual(servant);
  });
  it("returns undefined when not available", () => {
    expect(getRelatedServant(quests[2].id, "NA")).resolves.toBe(undefined);
  });
});

describe("getRelatedSkill", () => {
  it("maps skill when available", () => {
    expect(getRelatedSkill(servant.id, quests[0].id, "NA")).resolves.toEqual(
      servant.skills.find(skill => skill.id == 787451)
    );
  });
  it("returns undefined when no related skill is found", () => {
    expect(getRelatedSkill(servant.id, quests[2].id, "NA")).resolves.toBe(
      undefined
    );
  });
  it("return undefined when servant was not found", () => {
    expect(getRelatedSkill(0, quests[0].id, "NA")).resolves.toBe(undefined);
  });
});

describe("getRelatedNP", () => {
  it("maps NP when available", () => {
    expect(getRelatedNP(servant.id, quests[1].id, "NA")).resolves.toEqual(
      servant.noblePhantasms.find(np => np.id == 103002)
    );
  });
  it("returns undefined when no realted NP is found", () => {
    expect(getRelatedNP(servant.id, quests[2].id, "NA")).resolves.toBe(
      undefined
    );
  });
  it("return undefined when servant was not found", () => {
    expect(getRelatedNP(0, quests[1].id, "NA")).resolves.toBe(undefined);
  });
});
