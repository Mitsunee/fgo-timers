import { useItemMap } from "~/client/contexts";
import { ItemBackgroundFromBorder } from "~/items/itemBackgrounds";
import type { ComponentPropsCC } from "~/types/ComponentProps";
import { BorderedIcon } from "./BorderedIcon";
import { IconFace } from "./IconFace";
import styles from "./BorderedItemIcon.module.css";

interface BorderedItemIconProps extends ComponentPropsCC<"div"> {
  title?: undefined;
  itemId: number;
  disableSpoilers?: boolean;
}

export function BorderedItemIcon({
  children,
  itemId,
  disableSpoilers,
  ...props
}: BorderedItemIconProps) {
  const itemMap = useItemMap();
  const item = itemMap[itemId];
  const background = ItemBackgroundFromBorder[item.border];

  return (
    <BorderedIcon {...props} border={item.border}>
      <img src={background} alt={item.name} className={styles.bg} />
      <IconFace
        id={itemId}
        name={item.name}
        src={item.icon}
        placeholder="Item"
        na={item.na}
        forceIcon={disableSpoilers}
      />
      {children}
    </BorderedIcon>
  );
}
