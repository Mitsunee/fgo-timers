import { expandAtlasUrl } from "src/atlas-api/urls";
import { ItemBackgroundFromBorder } from "src/items/itemBackgrounds";
import type { BundledItem } from "src/items/types";
import { ComponentPropsCC } from "src/types/ComponentProps";
import { BorderedIcon } from "./BorderedIcon";
import styles from "./BorderedItemIcon.module.css";

interface BorderedItemIconProps extends ComponentPropsCC<"div">, BundledItem {
  title?: undefined;
}

export function BorderedItemIcon({
  children,
  icon,
  name,
  na,
  ...props
}: BorderedItemIconProps) {
  const item: BundledItem = { name, icon, border: props.border };
  if (na) item.na = true;
  const background = ItemBackgroundFromBorder[item.border];

  return (
    <BorderedIcon
      {...props}
      title={item.name} // TODO: consider spoilers
    >
      <img src={background} alt={item.name} className={styles.bg} />
      {/* TODO: BorderedIconFace component with spoiler support */}
      <img src={expandAtlasUrl(icon)} alt={name} className={styles.item} />
      {children}
    </BorderedIcon>
  );
}
