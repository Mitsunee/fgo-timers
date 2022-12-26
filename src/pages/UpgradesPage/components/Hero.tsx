import { BgColours, Borders } from "src/types/borders";
import { BundledServant } from "src/servants/types";
import { IconFace } from "src/client/components/BorderedIcon";
import styles from "./Hero.module.css";

type HeroProps = {
  border: Borders;
  id: number;
} & Pick<BundledServant, "name" | "icon" | "na">;

export function Hero({ border, id, name, icon, na }: HeroProps) {
  const bg = BgColours[border];
  const vars = { "--bg": bg } as React.CSSProperties;

  return (
    <header className={styles.hero} style={vars}>
      <div className={styles.iconWrapper}>
        <div className={styles.icon}>
          <IconFace
            id={id}
            name={name}
            na={na}
            src={icon}
            placeholder="Servant"
            width="76"
            height="76"
          />
        </div>
      </div>
    </header>
  );
}
