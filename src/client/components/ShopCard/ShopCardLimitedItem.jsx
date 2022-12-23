import { useIsClient } from "src/client/utils/hooks/useIsClient";
import { FGOItemListItem } from "src/client/components/FGOItemList";
import { DisplayDate } from "src/client/components/TimeDisplay";
import InlineIcon from "src/client/components/InlineIcon";

export default function ShopCardLimitedItem({ currency, data }) {
  const { cost, amount, stack, ends, icon, ...itemData } = data;
  const listData = {
    ...itemData,
    icon: `https://static.atlasacademy.io/${icon}`
  };
  const { name } = itemData;
  const isClient = useIsClient();

  return (
    <FGOItemListItem data={listData}>
      {stack && `${isClient ? stack.toLocaleString() : stack}x `}
      {name} ({amount}
      {stack ? ` stacks` : `x`}, {isClient ? cost.toLocaleString() : cost}{" "}
      <InlineIcon icon={currency} /> each)
      {isClient && (
        <>
          <br />
          Available until <DisplayDate time={ends * 1000} format="short" />
        </>
      )}
    </FGOItemListItem>
  );
}
