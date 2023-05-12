import Link from "next/link";
import styles from "./ShopLinkButton.module.css";
import { useItemMap } from "src/client/contexts";
import { expandAtlasUrl } from "@atlas-api/urls";

interface ShopLinkButtonProps extends React.PropsWithChildren {
  id: number;
  slug: string;
  title: string;
}

export function ShopLinkButton({
  children,
  id,
  slug,
  title
}: ShopLinkButtonProps) {
  const itemMap = useItemMap();
  const item = itemMap[id];
  const imageSrc = expandAtlasUrl(item.icon);

  return (
    <Link href={`/shops/${slug}`} className={styles.link} title={title}>
      <h2>{title}</h2>
      <img src={imageSrc} alt={item.name} />
      {children}
    </Link>
  );
}
