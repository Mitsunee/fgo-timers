//import styles from "./ShopCardLimitedItem.module.css";
import { useFormattedTimestamp } from "@utils/hooks/useFormattedTimestamp";
import { FGOItemListItem } from "@components/FGOItemList";
import InlineIcon from "@components/InlineIcon";

export default function ShopCardLimitedItem({ currency, data }) {
  const { cost, amount, stack, endsAt, ...itemData } = data;
  const { name } = itemData;
  const endDate = useFormattedTimestamp(endsAt, "short");

  return (
    <FGOItemListItem data={itemData}>
      {stack && `${stack.toLocaleString()}x `}
      {name}
      {amount && cost && (
        <>
          {`(${amount}${stack ? ` stacks` : `x`}, ${cost.toLocaleString()}) `}
          <InlineIcon icon={currency} /> each)
        </>
      )}
      <br />
      Available until {endDate}
    </FGOItemListItem>
  );
}
