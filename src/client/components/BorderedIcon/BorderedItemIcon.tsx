import { ItemBackgroundFromBorder } from "src/items/itemBackgrounds";
import type { BundledItem } from "src/items/types";
import type { ComponentPropsCC } from "src/types/ComponentProps";
import { BorderedIcon } from "./BorderedIcon";
import styles from "./BorderedItemIcon.module.css";
import { IconFace } from "./IconFace";

interface BorderedItemIconProps extends ComponentPropsCC<"div">, BundledItem {
  title?: undefined;
  itemId: number;
  disableSpoilers?: boolean;
}

export function BorderedItemIcon({
  children,
  itemId,
  name,
  icon,
  na,
  disableSpoilers,
  ...props
}: BorderedItemIconProps) {
  const item: BundledItem = { name, icon, border: props.border };
  if (na) item.na = true;
  const background = ItemBackgroundFromBorder[item.border];

  return (
    <BorderedIcon {...props}>
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
