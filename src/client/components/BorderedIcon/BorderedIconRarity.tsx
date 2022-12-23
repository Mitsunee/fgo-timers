import styles from "./BorderedIconRarity.module.css";

interface IconRarityProps {
  rarity: number;
}

export function BorderedIconRarity({ rarity }: IconRarityProps) {
  if (rarity < 1 || rarity > 5) return null;
  const title: string = `${Math.floor(rarity)}* Rarity`;

  return (
    <img
      src={`/assets/rarity/${Math.floor(rarity)}.png`}
      className={styles.icon}
      alt={title}
      title={title}
    />
  );
}
