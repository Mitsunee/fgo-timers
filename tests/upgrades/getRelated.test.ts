import type { Servant } from "@atlasacademy/api-connector/dist/Schema/Servant";
import { atlasCacheNA } from "src/atlas-api/cache";
import {
  getRelatedServant,
  getRelatedSkill,
  getRelatedNP
} from "src/upgrades/getRelated";

let servants: Servant[];
const quests: number[] = [
  91103002, // 0 - Quest related to Suzuka Gozen that upgrades a Skill
  94051272, // 1 - Quest related to Suzuka Gozen that upgrades her NP
  1000011, // 2 - Grand Order main quest (expected to be unrelated to any servant)
  91200102, // 3 - Interlude Quest that upgrades Emiya NP
  91202101, // 4 - Interlude Quest that upgrades Tomoe NP
  91402501 // 5 - Interlude Quest that upgrades Columbus NP
];

beforeAll(async () => {
  const niceServant = await atlasCacheNA.getNiceServant();
  const res = [
    niceServant.find(servant => servant.id === 103000), // 0 - Suzuka Gozen
    niceServant.find(servant => servant.id == 200100), // 1 - Emiya Archer - tested for typechanged NP
    niceServant.find(servant => servant.id == 202100), // 2 - Tomoe Gozen - tested for EoR NP
    niceServant.find(servant => servant.id == 402500) // 3 - Columbus - tested for EoR NP with multiple spoiler unlocks
  ];
  if (res.some(servant => !servant)) throw new Error("Invalid test data");
  servants = res as Servant[];
});

describe("getRelatedServant", () => {
  it("maps servant when available", () => {
    const suzuka = servants[0];
    expect(getRelatedServant(quests[0], "NA")).resolves.toEqual(suzuka);
  });
  it("returns undefined when not available", () => {
    expect(getRelatedServant(quests[2], "NA")).resolves.toBe(undefined);
  });
});

describe("getRelatedSkill", () => {
  it("maps skill when available", () => {
    const suzuka = servants[0];
    expect(getRelatedSkill(suzuka.id, quests[0], "NA")).resolves.toEqual(
      suzuka.skills.find(skill => skill.id == 787451)
    );
  });
  it("returns undefined when no related skill is found", () => {
    const suzuka = servants[0];
    expect(getRelatedSkill(suzuka.id, quests[2], "NA")).resolves.toBe(
      undefined
    );
  });
  it("return undefined when servant was not found", () => {
    expect(getRelatedSkill(0, quests[0], "NA")).resolves.toBe(undefined);
  });
});

describe("getRelatedNP", () => {
  it("maps NP when available", () => {
    const suzuka = servants[0];
    expect(getRelatedNP(suzuka.id, quests[1], "NA")).resolves.toEqual(
      suzuka.noblePhantasms.find(np => np.id == 103002)
    );
  });
  it("returns undefined when no related NP is found", () => {
    const suzuka = servants[0];
    expect(getRelatedNP(suzuka.id, quests[2], "NA")).resolves.toBe(undefined);
  });
  it("return undefined when servant was not found", () => {
    expect(getRelatedNP(0, quests[1], "NA")).resolves.toBe(undefined);
  });
  it("handles edgecase: type-changed NP", async () => {
    const emiya = servants[1];
    const relatedNP = await getRelatedNP(emiya.id, quests[3], "NA");
    expect(relatedNP).toBeDefined();
    expect(relatedNP!.id).toBe(200102);
  });
  it("handles edgecase: EoR NP", async () => {
    const tomoe = servants[2];
    const columbus = servants[3];
    let relatedNP = await getRelatedNP(tomoe.id, quests[4], "NA");
    expect(relatedNP).toBeDefined();
    expect(relatedNP!.id).toBe(202102);
    expect(relatedNP!.name).toBe("On Arorikya Sowaka");
    relatedNP = await getRelatedNP(columbus.id, quests[5], "NA");
    expect(relatedNP).toBeDefined();
    expect(relatedNP!.id).toBe(402503);
    expect(relatedNP!.name).toBe("Santa María Drop Anchor");
  });
});
