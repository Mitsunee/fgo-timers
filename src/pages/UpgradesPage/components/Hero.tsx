import { expandAtlasUrl } from "src/atlas-api/urls";
import { BgColours, Borders } from "src/types/borders";
import styles from "./Hero.module.css";

interface HeroProps {
  icon: string;
  border: Borders;
  title: string;
  // TODO: implement highlighted text from search result
}

export function Hero({ icon, border, title }: HeroProps) {
  const bg = BgColours[border];
  const vars = { "--bg": bg } as React.CSSProperties;
  return (
    <header className={styles.header} style={vars}>
      <section>
        {/* TODO: consider spoiler level */}
        {/* BUG: border doesn't work, needs to be a wrapper with gradient like in prod */}
        <img src={expandAtlasUrl(icon)} alt={title} width="100" height="100" />
      </section>
      <h1>{title}</h1>
    </header>
  );
}
