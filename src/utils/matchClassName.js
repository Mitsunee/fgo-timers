const baseClasses = [
  "saber",
  "archer",
  "lancer",
  "rider",
  "caster",
  "assassin",
  "berserker"
];

export function matchClassName(needle, haystack) {
  if (baseClasses.includes(needle)) {
    return haystack.includes(needle);
  }

  return haystack.includes("extra");
}
