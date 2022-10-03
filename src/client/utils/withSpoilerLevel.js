import { capitalize } from "@utils/capitalize";

//const spoilerIconMap = new Map([
//  ["skill", "https://static.atlasacademy.io/NA/SkillIcons/skill_999999.png"]
//]);

function getSpoilerName(subject, type) {
  switch (type) {
    case "skill":
      return `Skill ${subject.num}`;
    case "np":
      return "Noble Phantasm";
    case "servant": {
      // return with collectionNo if possible
      if (subject.collectionNo) return `Servant #${subject.collectionNo}`;
      // break omitted
    }
    default:
      return `${capitalize(type)} ${subject.id}`;
  }
}

function getSpoilerIcon(type) {
  let ret = "/assets/icon_spoiler.png";
  //if (spoilerIconMap.has(type)) ret = spoilerIconMap.get(type);

  // TEMP: temporarily just doing a direct check until there's more
  //       than one thing in spoilerIconMap
  if (type === "skill") {
    ret = "https://static.atlasacademy.io/NA/SkillIcons/skill_999999.png";
  }

  return ret;
}

export function withSpoilerLevel(subject, level, type = "servant") {
  if (subject.na) return subject;

  const clone = { ...subject };

  switch (level) {
    case "strict":
      clone.name = getSpoilerName(subject, type);
    // break omitted
    case "some":
      clone.icon &&= getSpoilerIcon(type);
  }

  return clone;
}
