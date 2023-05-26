import cc from "classcat";
import Headline from "src/client/components/Headline";
import { BgColours, BorderColours, Borders } from "src/types/borders";
import type { ComponentPropsCC } from "src/types/ComponentProps";
import { CardHero } from "./CardHero";
import styles from "./Card.module.css";

type CardHeroProps = React.ComponentProps<typeof CardHero>;

interface CardStyle extends React.CSSProperties {
  "--border": string;
  "--bg": string;
}

interface CardProps
  extends Omit<
      ComponentPropsCC<"article">,
      "color" | "style" | "title" | "placeholder"
    >,
    CardHeroProps {
  color?: Borders;
  style?: Partial<CardStyle>;
}

type CustomCardProps = Omit<CardProps, keyof CardHeroProps> &
  Partial<Record<keyof CardHeroProps, undefined>>;

export function Card({
  children,
  className,
  style: styleProp,
  color = Borders.BLUE,
  iconId,
  title,
  placeholder,
  icon,
  loading,
  forceRound,
  bypassSpoilers,
  ...props
}: CardProps | CustomCardProps) {
  const style: CardStyle = {
    "--border": BorderColours[color],
    "--bg": BgColours[color],
    ...styleProp // may override color properties
  };
  const heroProps: CardHeroProps | null = icon
    ? { icon, title, loading, forceRound, placeholder, iconId, bypassSpoilers }
    : null;

  return (
    <div className={styles.card}>
      <article {...props} className={cc(className)} style={style}>
        {heroProps ? (
          <>
            <CardHero {...heroProps} />
            <main>
              <Headline>
                {props.id ? (
                  <a href={`#${props.id}`}>{heroProps.title}</a>
                ) : (
                  heroProps.title
                )}
              </Headline>
              {children}
            </main>
          </>
        ) : (
          children
        )}
      </article>
    </div>
  );
}
