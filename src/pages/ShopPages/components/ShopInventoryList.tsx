import type { AnyShopInventory } from "src/schema/ShopSchema";
import styles from "./ShopInventoryList.module.css";
import {
  BorderedCEIcon,
  BorderedItemIcon,
  BorderedServantIcon
} from "src/client/components/BorderedIcon";
import { CommandCodeIcon } from "src/client/components/CommandCodeIcon";
import {
  useCCMap,
  useCEMap,
  useItemMap,
  useMysticCodeMap,
  useServantMap
} from "src/client/contexts";
import { InlineIcon, InlineImg } from "@components/InlineIcon";
import { expandAtlasUrl } from "@atlas-api/urls";

type AnyShopItems = AnyShopInventory["items"];
type AnyShopItem = AnyShopItems[number];

interface ShopInventoryListProps {
  items: AnyShopItems;
  currency: number;
}

interface ShopInventoryListItemProps {
  item: AnyShopItem;
  currencyId: number;
}

function InventoryIcon({ type, id }: Pick<AnyShopItem, "type" | "id">) {
  switch (type) {
    case "item":
      return <BorderedItemIcon itemId={id} className={styles.icon} />;
    case "ce":
      return <BorderedCEIcon ceId={id} className={styles.icon} />;
    case "cc":
      return <CommandCodeIcon ccId={id} className={styles.icon} />;
    case "servant":
      return <BorderedServantIcon servantId={id} className={styles.icon} />;
    case "mc":
      // PLACEHOLDER
      // TODO: MysticCodeIcon??
      return <b className={styles.icon}>MISSING</b>;
  }
}

function useDefaultName(id: number, type: AnyShopItem["type"]) {
  const itemMap = useItemMap();
  const ceMap = useCEMap();
  const ccMap = useCCMap();
  const servantMap = useServantMap();
  const mysticCodeMap = useMysticCodeMap();

  switch (type) {
    case "item":
      return itemMap[id].name;
    case "ce":
      return ceMap[id].name;
    case "cc":
      return ccMap[id].name;
    case "servant":
      return servantMap[id].name;
    case "mc":
      return mysticCodeMap[id].name;
  }
}

function ShopInventoryListItem({
  item,
  currencyId
}: ShopInventoryListItemProps) {
  const itemMap = useItemMap();
  const currencyItem = itemMap[currencyId];
  const defaultName = useDefaultName(item.id, item.type);

  return (
    <>
      <div className={styles.item}>
        <InventoryIcon id={item.id} type={item.type} />
        {/* PLACEHOLDER */}
        <span>{item.name || defaultName}</span>
        <span>
          {/* TODO: handle stack sizes */}
          {item.amount}x {item.cost}{" "}
          <InlineImg
            icon={expandAtlasUrl(currencyItem.icon)}
            title={currencyItem.name}
          />
        </span>
      </div>
    </>
  );
}

export function ShopInventoryList({ items, currency }: ShopInventoryListProps) {
  return (
    <li data-wide className={styles.container}>
      {items.map((item, idx) => (
        <ShopInventoryListItem key={idx} item={item} currencyId={currency} />
      ))}
    </li>
  );
}
