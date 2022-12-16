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
      <section>
        {/* BUG: border doesn't work, needs to be a wrapper with gradient like in prod */}
        <img
          src={expandAtlasUrl(icon)}
          alt={!na && hidden ? "Servant" : name}
          width="100"
          height="100"
        />
      </section>
      {/*
      <h1>
        {
          <SpoileredText id={id} placeholder="Servant" na={na}>
            {length ? (
              <SearchMatch text={name} index={index} length={length} />
            ) : (
              name
            )}
          </SpoileredText>
        }{" "}
        {title}
      </h1>*/}
    </header>
  );
}
