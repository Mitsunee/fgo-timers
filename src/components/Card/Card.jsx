import styles from "./Card.module.css";
import CardHero from "./CardHero";
import Headline from "@components/Headline";

export default function Card({ children, icon, title, background, border }) {
  return (
    <article
      className={styles.card}
      style={border ? { borderColor: border } : undefined}>
      <CardHero icon={icon} background={background} title={title} />
      <main className={styles.inner}>
        <Headline>{title}</Headline>
        {children}
      </main>
    </article>
  );
}
