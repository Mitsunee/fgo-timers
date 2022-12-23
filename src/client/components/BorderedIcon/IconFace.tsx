import cc from "classcat";
import { expandAtlasUrl } from "src/atlas-api/urls";
import { useSpoilerLevel } from "src/client/utils/hooks/useSpoilerLevel";
import { useSpoilerState } from "src/client/utils/hooks/useSpoilerState";
import { ComponentPropsCC } from "src/types/ComponentProps";
import { SpoilerLevels } from "src/types/enum";
import styles from "./IconFace.module.css";

interface IconFaceProps extends Omit<ComponentPropsCC<"img">, "id"> {
  id: number;
  name: string;
  src: string;
  alt?: undefined;
  title?: undefined;
  placeholder: string;
  na?: true;
  forceIcon?: true;
  lazy?: true; // TODO: implement lazyloading
}

export function IconFace({
  id,
  src,
  name,
  na,
  placeholder,
  forceIcon,
  className,
  ...props
}: IconFaceProps) {
  const [level] = useSpoilerLevel();
  const [hidden, toggleHidden] = useSpoilerState(id);
  const fullSrc = expandAtlasUrl(src);

  if (!na) {
    switch (level) {
      case SpoilerLevels.PRERENDER: {
        const displayName = `${placeholder} (Hover to reveal)`;

        return (
          <>
            <img
              {...props}
              src={fullSrc}
              className={cc([
                styles.face,
                styles.prerendered,
                forceIcon && styles.forced,
                className
              ])}
              alt={placeholder}
              title={displayName}
            />
            {!forceIcon && (
              <img
                src="/assets/spoiler.png"
                className={styles.spoiler}
                alt={placeholder}
              />
            )}
          </>
        );
      }
      case SpoilerLevels.SOME:
      case SpoilerLevels.STRICT: {
        const displayAlt =
          hidden && level == SpoilerLevels.STRICT ? placeholder : name;
        const displayTitle = `${displayAlt} (Click to ${
          hidden ? "reveal" : "hide"
        })`;

        return (
          <>
            <img
              {...props}
              src={fullSrc}
              className={cc([
                styles.face,
                hidden && !forceIcon && styles.hidden,
                className
              ])}
              alt={displayAlt}
              title={displayTitle}
              onClick={(...args) => {
                toggleHidden();
                props.onClick?.(...args);
              }}
            />
            {hidden && !forceIcon && (
              <img
                src="/assets/spoiler.png"
                className={styles.spoiler}
                alt={displayAlt}
                title={displayTitle}
                onClick={(...args) => {
                  toggleHidden();
                  props.onClick?.(...args);
                }}
              />
            )}
          </>
        );
      }
    }
  }

  return (
    <img
      {...props}
      src={fullSrc}
      className={cc([styles.face, className])}
      alt={name}
      title={name}
    />
  );
}
