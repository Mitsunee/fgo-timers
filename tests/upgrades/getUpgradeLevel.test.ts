import type { Servant } from "@atlasacademy/api-connector/dist/Schema/Servant";
import { atlasCache } from "src/atlas-api/cache";
import { getUpgradeLevel } from "src/upgrades/getUpgradeLevel";

let servants: Servant[];

beforeAll(async () => {
  const [niceServant, niceServantNA] = await Promise.all([
    atlasCache.JP.getNiceServant(),
    atlasCache.NA.getNiceServant()
  ]);
  const res = [
    niceServantNA.find(servant => servant.id == 103000), // 0 - Suzuka Gozen
    niceServantNA.find(servant => servant.id == 202100), // 1 - Tomoe Gozen
    niceServantNA.find(servant => servant.id == 200100), // 2 - Emiya Archer
    niceServantNA.find(servant => servant.id == 1100900), // 3 - Space Ishtar
    niceServant.find(servant => servant.id == 100800), // 4 - Siegfried (Golden Rule upgrade not yet released on NA)
    niceServant.find(servant => servant.id == 700700), // 5 - 5* Vlad (2nd NP upgrade not yet released on NA)
    niceServantNA.find(servant => servant.id == 100500) // 6 - Nero 4* Saber
  ];
  if (res.some(servant => !servant)) throw new Error("Invalid test data");
  servants = res as Servant[];
});

describe("getUpgradeLevel", () => {
  it("determines upgrade level for standard servant skills", () => {
    const suzuka = servants[0];
    expect(
      getUpgradeLevel(
        suzuka,
        // Mystic Eyes (skill with no upgrade path)
        suzuka.skills.find(skill => skill.id == 93451)!
      )
    ).toBe(0);
    expect(
      getUpgradeLevel(
        suzuka,
        // Unupgraded Skill with single Upgrade
        suzuka.skills.find(skill => skill.id == 359450)!
      )
    ).toBe(0);
    expect(
      getUpgradeLevel(
        suzuka,
        // Upgraded version of above
        suzuka.skills.find(skill => skill.id == 787451)!
      )
    ).toBe(1);
  });
  it("determines upgrade level for standard servant NPs", () => {
    const suzuka = servants[0];
    expect(
      getUpgradeLevel(
        suzuka,
        // not upgraded NP
        suzuka.noblePhantasms.find(np => np.id == 103001)!
      )
    ).toBe(0);
    expect(
      getUpgradeLevel(
        suzuka,
        // upgraded NP
        suzuka.noblePhantasms.find(np => np.id == 103002)!
      )
    ).toBe(1);
  });
  it("handles edgecase: EoR NPs", () => {
    const tomoe = servants[1];
    expect(
      getUpgradeLevel(tomoe, tomoe.noblePhantasms.find(np => np.id == 202100)!)
    ).toBe(0);
    expect(
      getUpgradeLevel(tomoe, tomoe.noblePhantasms.find(np => np.id == 202101)!)
    ).toBe(0);
    expect(
      getUpgradeLevel(tomoe, tomoe.noblePhantasms.find(np => np.id == 202102)!)
    ).toBe(1);
    expect(
      getUpgradeLevel(tomoe, tomoe.noblePhantasms.find(np => np.id == 202103)!)
    ).toBe(1);
  });
  it("handles edgecase: multi-upgrade Skill", () => {
    const emiya = servants[2];
    expect(
      getUpgradeLevel(emiya, emiya.skills.find(skill => skill.id == 94349)!)
    ).toBe(0);
    expect(
      getUpgradeLevel(emiya, emiya.skills.find(skill => skill.id == 263550)!)
    ).toBe(1);
    expect(
      getUpgradeLevel(emiya, emiya.skills.find(skill => skill.id == 754650)!)
    ).toBe(2);
  });
  it("handles edgecase: multi-type NPs", () => {
    const [, , emiya, spishtar] = servants;
    expect(
      getUpgradeLevel(emiya, emiya.noblePhantasms.find(np => np.id == 200101)!)
    ).toBe(0);
    expect(
      getUpgradeLevel(emiya, emiya.noblePhantasms.find(np => np.id == 200102)!)
    ).toBe(1);
    expect(
      getUpgradeLevel(emiya, emiya.noblePhantasms.find(np => np.id == 200197)!)
    ).toBe(-1);
    expect(
      getUpgradeLevel(
        spishtar,
        spishtar.noblePhantasms.find(np => np.id == 1100901)!
      )
    ).toBe(0);
  });
  it("handles edgecase: improperly enumerated priority on skill", () => {
    const siegfried = servants[4];
    expect(
      getUpgradeLevel(
        siegfried,
        siegfried.skills.find(skill => skill.id == 97349)!
      )
    ).toBe(0);
    expect(
      getUpgradeLevel(
        siegfried,
        siegfried.skills.find(skill => skill.id == 2077550)!
      )
    ).toBe(1);
  });
  it("handles edgecase: multi-upgrade NPs", () => {
    const vlad = servants[5];
    expect(
      getUpgradeLevel(vlad, vlad.noblePhantasms.find(np => np.id == 700701)!)
    ).toBe(0);
    expect(
      getUpgradeLevel(vlad, vlad.noblePhantasms.find(np => np.id == 700702)!)
    ).toBe(1);
    expect(
      getUpgradeLevel(vlad, vlad.noblePhantasms.find(np => np.id == 700703)!)
    ).toBe(2);
  });
  it("handles edgecase: 3rd skill unlocked by upgrade", () => {
    const nero = servants[6];
    expect(
      getUpgradeLevel(nero, nero.skills.find(skill => skill.id == 154550)!)
    ).toBe(0);
  });
});
