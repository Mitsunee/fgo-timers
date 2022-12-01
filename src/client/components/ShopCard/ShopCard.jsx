import { Card } from "src/client/components/Card";
import { FGOItemList } from "src/client/components/FGOItemList";
import { NoSSR } from "src/client/components/NoSSR";
import { DisplayDelta, DisplayDate } from "src/client/components/TimeDisplay";
import ShopCardListItem from "./ShopCardListItem";
import ShopCardLimitedItem from "./ShopCardLimitedItem";

export default function ShopCard({ shopData, endsAt }) {
  const { inventory, limited, icon, ...cardProps } = shopData;
  const currency = `https://static.atlasacademy.io/${icon}`;

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
            <DisplayDelta time={endsAt} /> (
            <DisplayDate time={endsAt} format="short" />)
          </p>
        </NoSSR>
      )}
      {limited?.length > 0 && (
        <>
          <h2>Special Inventory</h2>
          <FGOItemList>
            {limited.map(data => (
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
