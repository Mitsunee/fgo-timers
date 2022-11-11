export enum Borders {
  BLACK,
  BRONZE,
  SILVER,
  GOLD,
  RED,
  BLUE,
  ZERO
}

export const BorderColours: Record<Borders, string> = {
  [Borders.BLACK]: "#000000",
  [Borders.BRONZE]: "#7d583b",
  [Borders.SILVER]: "#c1c1c1",
  [Borders.GOLD]: "#f0ce02",
  [Borders.RED]: "#a00920",
  [Borders.BLUE]: "#5aa8c3",
  [Borders.ZERO]: "#9db5b5"
};
