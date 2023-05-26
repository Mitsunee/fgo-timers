import ccat from "classcat";
import { useCCMap } from "~/client/contexts";
import { IconFace } from "~/components/BorderedIcon";
import { BorderedIconRarity } from "~/components/BorderedIcon/BorderedIconRarity";
import { CCBackgroundFromBorder } from "~/items/ccBackgrounds";
import type { ComponentPropsCC } from "~/types/ComponentProps";
import styles from "./CommandCodeIcon.module.css";

interface BorderedCCIconProps extends ComponentPropsCC<"div"> {
  title?: undefined;
  showRarity?: boolean;
  ccId: number;
  disableSpoilers?: boolean;
}

export function CommandCodeIcon({
  children,
  className,
  showRarity,
  ccId,
  disableSpoilers,
  ...props
}: BorderedCCIconProps) {
  const ccMap = useCCMap();
  const cc = ccMap[ccId];
  const background = CCBackgroundFromBorder[cc.border];

  return (
    <div {...props} className={ccat([styles.icon, className])}>
      <img src={background} alt={cc.name} className={styles.bg} />
      <IconFace
        id={ccId}
        name={cc.name}
        src={cc.icon}
        placeholder={`${cc.rarity}* Command Code`}
        na={cc.na}
        forceIcon={disableSpoilers}
        className={styles.face}
      />
      {showRarity && <BorderedIconRarity rarity={cc.rarity} />}
      {children}
    </div>
  );
}
