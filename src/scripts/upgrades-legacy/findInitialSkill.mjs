export function findInitialSkill({ owner, num, priority }, skills) {
  const relatedSkills = skills.filter(
    skill =>
      skill.owner == owner && skill.num == num && skill.priority < priority
  );

  if (relatedSkills.length < 1) return null;
  const res = relatedSkills[relatedSkills.length - 1];
  res.priority = Math.max(0, priority - 1); // NOTE: really bad hack, hopefully works for now until this gets rewritten with a proper backend solution...

  return res;
}
