import { borderColors } from "../borderColors.mjs";

export const describeSkill = (skillData, skillDataNA) => ({
  name: skillDataNA?.name || skillData.name,
  num: skillData.num,
  icon: skillData.icon,
  border: borderColors.get(skillData.priority),
  na: skillDataNA ? true : undefined
});
