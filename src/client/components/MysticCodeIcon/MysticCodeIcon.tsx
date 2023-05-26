import cc from "classcat";
import { IconFace } from "~/client/components/BorderedIcon";
import { useMysticCodeMap } from "~/client/contexts";
import type { ComponentPropsCC } from "~/types/ComponentProps";
import styles from "./MysticCodeIcon.module.css";

interface MysticCodeIconProps extends ComponentPropsCC<"div"> {
  title?: undefined;
  mcId: number;
  disableSpoilers?: boolean;
}

export function MysticCodeIcon({
  children,
  className,
  mcId,
  disableSpoilers,
  ...props
}: MysticCodeIconProps) {
  const mysticCodeMap = useMysticCodeMap();
  const mysticCode = mysticCodeMap[mcId];

  return (
    <div {...props} className={cc([styles.icon, className])}>
      <IconFace
        id={mcId}
        name={mysticCode.name}
        // TODO: add setting to toggle gender?
        src={mysticCode.iconF}
        placeholder="Mystic Code"
        na={mysticCode.na}
        forceIcon={disableSpoilers}
      />
      {children}
    </div>
  );
}
