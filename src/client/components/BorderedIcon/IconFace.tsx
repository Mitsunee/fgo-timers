import cc from "classcat";
import Image from "next/image";
import { expandAtlasUrl } from "src/atlas-api/urls";
import { useSpoilerLevel } from "src/client/utils/hooks/useSpoilerLevel";
import { useSpoilerState } from "src/client/utils/hooks/useSpoilerState";
import { ComponentPropsCC } from "src/types/ComponentProps";
import { SpoilerLevels } from "src/types/enum";
import styles from "./IconFace.module.css";

type ImageProps = Omit<ComponentPropsCC<typeof Image>, "id" | "placeholder">;
type ImageLayout =
  | Required<Pick<ImageProps, "width" | "height">>
  | { layout: "fill" };

interface IconFaceProps extends ImageProps {
  id: number;
  name: string;
  /**
   * May be shortened url
   */
  src: string;
  /**
   * Set name instead
   */
  alt?: undefined;
  /**
   * Set name instead
   */
  title?: undefined;
  /**
   * Shown in place of name if mode is strict and during prerender
   */
  placeholder?: string;
  na?: true;
  /**
   * Bypasses spoiler system
   */
  forceIcon?: boolean;
}

export function IconFace({
  id = 0,
  src,
  name,
  na,
  placeholder,
  forceIcon,
  className,
  width,
  height,
  loading = "lazy",
  ...props
}: IconFaceProps) {
  const [level] = useSpoilerLevel();
  const [hidden, toggleHidden] = useSpoilerState(id);
  const fullSrc = expandAtlasUrl(src);
  const isForced = na || forceIcon || level == SpoilerLevels.ALL;
  const showsName = isForced || level == SpoilerLevels.SOME || !hidden;
  const showsIcon = isForced || !hidden;

  const alt = isForced ? name : `${showsName ? name : placeholder ?? name}`;
  const title = isForced
    ? name
    : `${alt} (${level == SpoilerLevels.PRERENDER ? "Hover" : "Click"} to ${
        hidden ? "reveal" : "hide"
      })`.trim();

  const handleClick: React.MouseEventHandler<React.ElementRef<"img">> = (
    ...args
  ) => {
    toggleHidden();
    props.onClick?.(...args);
  };

  const imgLayout: ImageLayout =
    props.layout == "fill" || width == undefined || height == undefined
      ? { layout: "fill" }
      : { width, height };

  return (
    <>
      <Image
        {...props}
        {...imgLayout}
        loading={loading}
        unoptimized
        src={fullSrc}
        alt={alt}
        title={title}
        className={cc([
          styles.face,
          !showsIcon &&
            (level == SpoilerLevels.PRERENDER
              ? !isForced && styles.prerendered
              : styles.hidden),
          className
        ])}
        onClick={
          !isForced && level != SpoilerLevels.PRERENDER
            ? handleClick
            : undefined
        }
      />
      {!showsIcon && (
        <img
          src="/assets/spoiler.png"
          alt={alt}
          title={title}
          className={cc([
            styles.spoiler,
            level == SpoilerLevels.PRERENDER && styles.prerendered
          ])}
          onClick={level != SpoilerLevels.PRERENDER ? handleClick : undefined}
        />
      )}
    </>
  );
}
