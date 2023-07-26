import { useStore } from "@nanostores/react";
import cc from "classcat";
import { useMysticCodeMap } from "~/client/contexts";
import { settingsStore } from "~/client/stores/settingsStore";
import { IconFace } from "~/components/BorderedIcon";
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
  const { playerGender } = useStore(settingsStore);

  return (
    <div {...props} className={cc([styles.icon, className])}>
      <IconFace
        id={mcId}
        name={mysticCode.name}
        src={playerGender == "F" ? mysticCode.iconF : mysticCode.iconM}
        placeholder="Mystic Code"
        na={mysticCode.na}
        forceIcon={disableSpoilers}
      />
      {children}
    </div>
  );
}
