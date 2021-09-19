//import styles from "./ShopCardListItem.module.css";
import { FGOItemListItem } from "@components/FGOItemList";
import InlineIcon from "@components/InlineIcon";

export default function ShopCardListItem({ currency, data }) {
  const { cost, amount, stack, ...itemData } = data;
  const { name } = itemData;

  return (
    <FGOItemListItem data={itemData}>
      {stack && `${stack.toLocaleString()}x `}
      {name} ({amount}
      {stack ? ` stacks` : `x`}, {cost.toLocaleString()}{" "}
      <InlineIcon icon={currency} /> each)
    </FGOItemListItem>
  );
}
