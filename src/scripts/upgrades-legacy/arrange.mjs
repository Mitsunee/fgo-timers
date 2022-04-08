const flatMapSkills = servant =>
  servant.skills.map(skill => ({ ...skill, owner: servant.id }));

const flatMapNPs = servant =>
  servant.noblePhantasms
    .map(np => ({ ...np, owner: servant.id }))
    .filter(({ num }) => num === 1);

export const arrangeNPs = niceServant => ({
  jp: niceServant.jp.flatMap(flatMapNPs),
  na: niceServant.na.flatMap(flatMapNPs)
});

export const arrangeSkills = niceServant => ({
  jp: niceServant.jp.flatMap(flatMapSkills),
  na: niceServant.na.flatMap(flatMapSkills)
});
