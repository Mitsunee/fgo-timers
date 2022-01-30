//import styles from "./ShopCardLimitedItem.module.css";
import { useIsClient } from "@utils/hooks/useIsClient";
import { useFormattedTimestamp } from "@utils/hooks/useFormattedTimestamp";
import { FGOItemListItem } from "@components/FGOItemList";
import InlineIcon from "@components/InlineIcon";

export default function ShopCardLimitedItem({ currency, data }) {
  const { cost, amount, stack, ends, icon, ...itemData } = data;
  const { name } = itemData;
  const isClient = useIsClient();
  const endDate = useFormattedTimestamp(ends * 1000, "short");

  return (
    <FGOItemListItem
      data={itemData}
      icon={`https://static.atlasacademy.io/${icon}`}>
      {stack && `${isClient ? stack.toLocaleString() : stack}x `}
      {name}
      {amount && cost && (
        <>
          {`(${amount}${stack ? ` stacks` : `x`}, ${
            isClient ? cost.toLocaleString() : cost
          }) `}
          <InlineIcon icon={currency} /> each)
        </>
      )}
      <br />
      {isClient && <>Available until {endDate}</>}
    </FGOItemListItem>
  );
}
