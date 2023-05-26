import { getSkillNum } from "~/servants/getSkillNum";
import { PLACEHOLDER_SKILL } from "~/servants/placeholder";

describe("getSkillNum", () => {
  it("correctly returns num when prop is number", () => {
    const skill = {
      ...PLACEHOLDER_SKILL,
      num: 1
    };
    expect(getSkillNum(skill, 0)).toBe(1);
  });
  it("correctly gets num from IDMap", () => {
    const skill = {
      ...PLACEHOLDER_SKILL,
      num: { 40: 1, 50: 2 }
    };
    expect(getSkillNum(skill, 40)).toBe(1);
    expect(getSkillNum(skill, 50)).toBe(2);
    expect(getSkillNum(skill, 0)).toBe(1); // default value
  });
});
