const flatMapSkills = servant =>
  servant.skills.map(skill => ({ ...skill, owner: servant.id }));

const flatMapNPs = servant =>
  servant.noblePhantasms
    .map(np => ({ ...np, owner: servant.id }))
    .filter(({ num }) => num === 1);

const sortNPsCompare = (a, b) => {
  if (a.owner != b.owner) return a.owner - b.owner;
  if (a.priority != b.priority) return a.priority - b.priority;
  return a.id - b.id;
};

const sortSkillsCompare = (a, b) => {
  if (a.owner != b.owner) return a.owner - b.owner;
  if (a.num != b.num) return a.num - b.num;
  return a.priority - b.priority;
};

export const arrangeNPs = niceServant => ({
  jp: niceServant.jp.flatMap(flatMapNPs).sort(sortNPsCompare),
  na: niceServant.na.flatMap(flatMapNPs).sort(sortNPsCompare)
});

export const arrangeSkills = niceServant => ({
  jp: niceServant.jp.flatMap(flatMapSkills).sort(sortSkillsCompare),
  na: niceServant.na.flatMap(flatMapSkills).sort(sortSkillsCompare)
});
