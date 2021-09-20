import { useMemo } from "react";
import spacetime from "spacetime";

//import styles from "./ShopCard.module.css";
import { useFormattedSpacetime } from "@utils/hooks/useFormattedSpacetime";
import { useFormattedDelta } from "@utils/hooks/useFormattedDelta";
import { Card } from "@components/Card";
import { FGOItemList /*, FGOItemListItem*/ } from "@components/FGOItemList";
import NoSSR from "@components/NoSSR";
import ShopCardListItem from "./ShopCardListItem";
import ShopCardLimitedItem from "./ShopCardLimitedItem";

export default function ShopCard({ shopData, interval, endsAt }) {
  const { inventory, limitedInventory, ...cardProps } = shopData;
  const endsAtSpaceTime = useMemo(() => spacetime(endsAt), [endsAt]);
  const nextMonthDate = useFormattedSpacetime(endsAtSpaceTime || null, "short");
  const nextMonthDelta = useFormattedDelta(interval, endsAtSpaceTime || null);

  return (
    <Card {...cardProps}>
      <h2>Monthly Inventory</h2>
      <FGOItemList>
        {inventory.map(data => (
          <ShopCardListItem
            key={data.name}
            currency={cardProps.icon}
            data={data}
          />
        ))}
      </FGOItemList>
      {endsAt && (
        <NoSSR>
          <span>
            Next shop rotation:
            <br />
            {nextMonthDelta} ({nextMonthDate})
          </span>
        </NoSSR>
      )}
      {limitedInventory?.length > 0 && (
        <>
          <h2>Special Inventory</h2>
          <FGOItemList>
            {limitedInventory.map(data => (
              <ShopCardLimitedItem
                key={data.name}
                currency={cardProps.icon}
                data={data}
              />
            ))}
          </FGOItemList>
        </>
      )}
    </Card>
  );
}
