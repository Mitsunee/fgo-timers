import styles from "./BorderedIconRarity.module.css";

interface IconRarityProps {
  rarity: number;
}

export function BorderedIconRarity({ rarity }: IconRarityProps) {
  if (rarity < 0 || rarity > 5) return null;
  const title: string = `${rarity}* Rarity`;

  return (
    <img
      src={`/assets/rarity/${Math.floor(rarity)}.png`}
      className={styles.icon}
      alt={title}
      title={title}
    />
  );
}
