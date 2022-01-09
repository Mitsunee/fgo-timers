//import styles from "./ShopCardListItem.module.css";
import { useIsClient } from "@utils/hooks/useIsClient";
import { FGOItemListItem } from "@components/FGOItemList";
import InlineIcon from "@components/InlineIcon";

export default function ShopCardListItem({ currency, data }) {
  const { cost, amount, stack, ...itemData } = data;
  const { name } = itemData;
  const isClient = useIsClient();

  return (
    <FGOItemListItem data={itemData}>
      {stack && `${isClient ? stack.toLocaleString() : stack}x `}
      {name} ({amount}
      {stack ? ` stacks` : `x`}, {isClient ? cost.toLocaleString() : cost}{" "}
      <InlineIcon icon={currency} /> each)
    </FGOItemListItem>
  );
}
