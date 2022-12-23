import { BgColours, Borders } from "src/types/borders";
import { useSpoilerState } from "src/client/utils/hooks/useSpoilerState";
import { expandAtlasUrl } from "src/atlas-api/urls";
import { BundledServant } from "src/servants/types";
import styles from "./Hero.module.css";

type HeroProps = {
  border: Borders;
  id: number;
} & Pick<BundledServant, "name" | "icon" | "na">;

export function Hero({ border, id, name, icon, na }: HeroProps) {
  const bg = BgColours[border];
  const vars = { "--bg": bg } as React.CSSProperties;
  const [hidden] = useSpoilerState(id);

  return (
    <header className={styles.hero} style={vars}>
      <div className={styles.icon}>
        <img
          src={expandAtlasUrl(icon)}
          alt={!na && hidden ? "Servant" : name}
          width="76"
          height="76"
        />
      </div>
    </header>
  );
}
