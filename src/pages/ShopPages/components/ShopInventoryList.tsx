import { expandAtlasUrl } from "~/atlas-api/urls";
import {
  BorderedCEIcon,
  BorderedItemIcon,
  BorderedServantIcon
} from "~/client/components/BorderedIcon";
import { BorderedCostumeIcon } from "~/client/components/BorderedIcon/BorderedCostumeIcon";
import { CommandCodeIcon } from "~/client/components/CommandCodeIcon";
import { InlineImg } from "~/client/components/InlineIcon";
import { MysticCodeIcon } from "~/client/components/MysticCodeIcon";
import {
  useCCMap,
  useCEMap,
  useCostumeMap,
  useItemMap,
  useMysticCodeMap,
  useServantMap
} from "~/client/contexts";
import type { AnyShopInventory } from "~/schema/ShopSchema";
import styles from "./ShopInventoryList.module.css";

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
      return <MysticCodeIcon mcId={id} className={styles.icon} />;
    case "costume":
      return <BorderedCostumeIcon costumeId={id} className={styles.icon} />;
  }
}

function useDefaultName(id: number, type: AnyShopItem["type"]) {
  const itemMap = useItemMap();
  const ceMap = useCEMap();
  const ccMap = useCCMap();
  const servantMap = useServantMap();
  const mysticCodeMap = useMysticCodeMap();
  const costumeMap = useCostumeMap();

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
    case "costume":
      return costumeMap[id].name;
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
        <span>
          {typeof item.stack == "number" && `${item.stack}x `}
          {item.name || defaultName}
        </span>
        <span>
          {item.amount > 1 &&
            `${item.amount}${
              typeof item.stack == "number" ? " stacks" : "x"
            } `}{" "}
          {item.cost}{" "}
          <InlineImg
            icon={expandAtlasUrl(currencyItem.icon)}
            title={currencyItem.name}
          />
          {item.amount > 1 && " each"}
        </span>
        {item.requires && (
          <span className={styles.wide}>
            <b>Requires:</b> {item.requires}
          </span>
        )}
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
