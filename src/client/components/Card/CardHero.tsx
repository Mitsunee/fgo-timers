import Image from "next/image";
import styles from "./CardHero.module.css";

interface CardHeroProps
  extends Pick<React.ComponentProps<typeof Image>, "loading"> {
  title: string;
  icon: string;
  forceRound?: true;
}

export default function CardHero({
  title,
  icon,
  forceRound,
  // backgroundImage,
  loading = "lazy"
}: CardHeroProps) {
  // TODO: Not implemented: backgroundImage
  // TODO: Support IconFace for UpgradeCard
  //if (backgroundImage) style.backgroundImage = `url("${backgroundImage}")`;

  return (
    <header className={styles.hero}>
      <div className={styles.icon}>
        <Image
          src={icon}
          width="76"
          height="76"
          loading={loading}
          alt={title}
          style={{ borderRadius: forceRound ? "100%" : 0 }}
        />
      </div>
    </header>
  );
}
