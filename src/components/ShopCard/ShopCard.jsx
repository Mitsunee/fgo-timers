import { useMemo } from "react";
import spacetime from "spacetime";

//import styles from "./ShopCard.module.css";
import { useFormattedSpacetime } from "@utils/hooks/useFormattedSpacetime";
import { useFormattedDelta } from "@utils/hooks/useFormattedDelta";
import { Card } from "@components/Card";
import { FGOItemList } from "@components/FGOItemList";
import NoSSR from "@components/NoSSR";
import ShopCardListItem from "./ShopCardListItem";
import ShopCardLimitedItem from "./ShopCardLimitedItem";

export default function ShopCard({ shopData, endsAt }) {
  const { inventory, limitedInventory, icon, ...cardProps } = shopData;
  const currency = `https://static.atlasacademy.io/${icon}`;
  const endsAtSpaceTime = useMemo(() => spacetime(endsAt), [endsAt]);
  const nextMonthDate = useFormattedSpacetime(endsAtSpaceTime || null, "short");
  const nextMonthDelta = useFormattedDelta(endsAtSpaceTime || null);

  return (
    <Card {...cardProps} icon={currency}>
      <h2>Monthly Inventory</h2>
      <FGOItemList>
        {inventory.map(data => (
          <ShopCardListItem key={data.name} currency={currency} data={data} />
        ))}
      </FGOItemList>
      {endsAt && (
        <NoSSR>
          <p>
            Next shop rotation:
            <br />
            {nextMonthDelta} ({nextMonthDate})
          </p>
        </NoSSR>
      )}
      {limitedInventory?.length && (
        <>
          <h2>Special Inventory</h2>
          <FGOItemList>
            {limitedInventory.map(data => (
              <ShopCardLimitedItem
                key={data.name}
                currency={currency}
                data={data}
              />
            ))}
          </FGOItemList>
        </>
      )}
    </Card>
  );
}
