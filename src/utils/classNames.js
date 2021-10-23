export const baseClasses = new Set([
  "saber",
  "archer",
  "lancer",
  "rider",
  "caster",
  "assassin",
  "berserker"
]);

export const extraClasses = new Set([
  "shielder",
  "ruler",
  "avenger",
  "mooncancer",
  "alterEgo",
  "foreigner",
  "pretender"
]);

export const classes = new Set([
  ...baseClasses.values(),
  ...extraClasses.values()
]);
