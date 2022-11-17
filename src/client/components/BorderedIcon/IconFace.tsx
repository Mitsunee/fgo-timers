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
}

export function IconFace({
  id,
  src,
  name,
  na,
  placeholder,
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
              className={cc([styles.face, styles.prerendered, className])}
              alt={displayName}
              title={displayName}
            />
            <img src="/assets/spoiler.png" alt={displayName} />
          </>
        );
      }
      case SpoilerLevels.SOME:
      case SpoilerLevels.STRICT: {
        const displayName = `${
          hidden && level == SpoilerLevels.STRICT ? placeholder : name
        } (Click to ${hidden ? "reveal" : "hide"})`;

        return (
          <>
            <img
              {...props}
              src={fullSrc}
              className={cc([styles.face, hidden && styles.hidden, className])}
              alt={displayName}
              title={displayName}
              onClick={(...args) => {
                toggleHidden();
                props.onClick?.(...args);
              }}
            />
            <img src="/assets/spoiler.png" alt={displayName} />
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
