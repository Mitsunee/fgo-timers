import type { Servant } from "@atlasacademy/api-connector/dist/Schema/Servant";
import { atlasCache } from "~/atlas-api/cache";
import { getPreviousNP, getPreviousSkill } from "~/upgrades/getPrevious";

let servants: Servant[];

beforeAll(async () => {
  const [niceServant, niceServantNA] = await Promise.all([
    atlasCache.JP.getNiceServant(),
    atlasCache.NA.getNiceServant()
  ]);
  const res = [
    niceServantNA.find(servant => servant.id == 103000), // 0 - Suzuka Gozen - standard servant
    niceServantNA.find(servant => servant.id == 202100), // 1 - Tomoe Gozen - EoR Servant
    niceServantNA.find(servant => servant.id == 200100), // 2 - Emiya Archer - double skill upgrade & multi-type upgraded NP
    niceServant.find(servant => servant.id == 100800), // 3 - Siegfried (Golden Rule upgrade not yet released on NA)
    niceServant.find(servant => servant.id == 700700), // 4 - 5* Vlad - double NP upgrade
    niceServantNA.find(servant => servant.id == 100500) // 5 - Nero 4* Saber - skill unlocked by upgrade
  ];
  if (res.some(servant => !servant)) throw new Error("Invalid test data");
  servants = res as Servant[];
});

describe("getPreviousSkill", () => {
  it("handles standard servant", () => {
    const suzuka = servants[0];
    expect(
      getPreviousSkill(suzuka, suzuka.skills.find(skill => skill.id == 787451)!)
    ).toEqual(suzuka.skills.find(skill => skill.id == 359450));
    expect(
      getPreviousSkill(suzuka, suzuka.skills.find(skill => skill.id == 93451)!)
    ).toBe(undefined);
  });
  it("handles edgecase: double skill upgrade", () => {
    const emiya = servants[2];
    const skill = emiya.skills
      .filter(skill => skill.num == 3)
      .sort((a, b) => a.id - b.id); // sorted by upgrade level where 0 is no upgrade, 2 is both
    expect(getPreviousSkill(emiya, skill[2])).toEqual(skill[1]);
    expect(getPreviousSkill(emiya, skill[1])).toEqual(skill[0]);
    expect(getPreviousSkill(emiya, skill[0])).toBe(undefined);
  });
  it("handles edgecase: improperly enumerated skill", () => {
    const siegfried = servants[3];
    expect(
      getPreviousSkill(
        siegfried,
        siegfried.skills.find(skill => skill.id == 2077550)!
      )
    ).toEqual(siegfried.skills.find(skill => skill.id == 97349));
  });
  it("handles edgecase: 3rd skill unlocked by upgrade", () => {
    const nero = servants[5];
    expect(
      getPreviousSkill(nero, nero.skills.find(skill => skill.id == 154550)!)
    ).toBe(undefined);
  });
});

describe("getPreviousNP", () => {
  it("handles standard servant", () => {
    const suzuka = servants[0];
    const noup = suzuka.noblePhantasms.find(np => np.id == 103001)!;
    expect(
      getPreviousNP(suzuka, suzuka.noblePhantasms.find(np => np.id == 103002)!)
    ).toEqual(noup);
    expect(() => getPreviousNP(suzuka, noup)).toThrowError(
      /Could not find previous/
    );
  });
  it("handles edgecase: EoR NP", () => {
    const tomoe = servants[1];
    const result = getPreviousNP(
      tomoe,
      tomoe.noblePhantasms.find(np => np.id == 202102)!
    );
    expect(result.id).toBe(202100);
    expect(result.name).toBe("???");
  });
  it("handles edgecase: multi-type np", () => {
    const emiya = servants[2];
    expect(
      getPreviousNP(emiya, emiya.noblePhantasms.find(np => np.id == 200102)!)
    ).toEqual(emiya.noblePhantasms.find(np => np.id == 200101));
  });
  it("handles edgecase: double np upgrade", () => {
    const vlad = servants[4];
    const nps = vlad.noblePhantasms.sort((a, b) => a.id - b.id); // sorted by upgrade level where 0 is no upgrade, 2 is both
    expect(getPreviousNP(vlad, nps[2])).toEqual(nps[1]);
    expect(getPreviousNP(vlad, nps[1])).toEqual(nps[0]);
    expect(() => getPreviousNP(vlad, nps[0])).toThrow(
      /Could not find previous/
    );
  });
});
