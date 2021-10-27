import cc from "classcat";

import styles from "./Card.module.css";
import { borderColors, backgroundColors } from "@styles/fgoIconTheme";
import CardHero from "./CardHero";
import Headline from "@components/Headline";

export default function Card({
  children,
  icon,
  title,
  color,
  forceRoundIcon,
  className,
  wrapperClassName,
  style,
  ...props
}) {
  const articleStyle = typeof style === "object" ? style : new Object();
  if (color) articleStyle.borderColor = borderColors.get(color);

  return (
    <div className={wrapperClassName || undefined}>
      <article
        {...props}
        className={cc([styles.card, className])}
        style={articleStyle}>
        <CardHero
          icon={icon}
          background={color && backgroundColors.get(color)}
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
