import { IconFace } from "src/client/components/BorderedIcon";
import styles from "./CardHero.module.css";

type CardHeroProps = Pick<
  React.ComponentProps<typeof IconFace>,
  "loading" | "placeholder"
> & {
  title: string;
  icon: string;
  forceRound?: boolean;
  id?: number;
  bypassSpoilers?: true;
};

export function CardHero({
  id = 0,
  title,
  placeholder,
  icon,
  forceRound,
  bypassSpoilers,
  // backgroundImage,
  loading = "lazy"
}: CardHeroProps) {
  // TODO: Not implemented: backgroundImage
  //if (backgroundImage) style.backgroundImage = `url("${backgroundImage}")`;

  return (
    <header className={styles.hero}>
      <div className={styles.icon}>
        <IconFace
          src={icon}
          id={id}
          name={title}
          placeholder={placeholder}
          forceIcon={bypassSpoilers || id == 0}
          loading={loading}
          style={{ borderRadius: forceRound ? "100%" : 0 }}
          width={76}
          height={76}
        />
      </div>
    </header>
  );
}
