import { useItemMap } from "src/client/contexts";
import { ItemBackgroundFromBorder } from "src/items/itemBackgrounds";
import type { ComponentPropsCC } from "src/types/ComponentProps";
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
