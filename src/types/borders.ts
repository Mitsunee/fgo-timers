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

// TODO: make sure the colours look good (some are a bit dark right now)
export const BgColours: Record<Borders, string> = {
  [Borders.BLACK]: "#111111",
  [Borders.BRONZE]: "#56361d",
  [Borders.SILVER]: "#6d6d6d",
  [Borders.GOLD]: "#f9e677",
  [Borders.RED]: "#e22b52",
  [Borders.BLUE]: "#366baf",
  [Borders.ZERO]: "#82b1c3"
};
