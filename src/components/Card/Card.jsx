import cc from "classcat";

import styles from "./Card.module.css";
import CardHero from "./CardHero";
import Headline from "@components/Headline";

export default function Card({
  children,
  icon,
  title,
  background,
  border,
  forceRoundIcon,
  className,
  wrapperClassName,
  style,
  ...props
}) {
  const articleStyle = typeof style === "object" ? style : new Object();
  if (border) articleStyle.borderColor = border;

  return (
    <div className={wrapperClassName || undefined}>
      <article
        {...props}
        className={cc([styles.card, className])}
        style={border || style ? articleStyle : undefined}>
        <CardHero
          icon={icon}
          background={background}
          title={title}
          forceRoundIcon={forceRoundIcon}
        />
        <main className={styles.inner}>
          <Headline>{title}</Headline>
          {children}
        </main>
      </article>
    </div>
  );
}
