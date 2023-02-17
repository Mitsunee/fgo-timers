import { expandAtlasUrl } from "src/atlas-api/urls";
import { Card } from "src/client/components/Card";
import { FGOItemList } from "src/client/components/FGOItemList";
import { NoSSR } from "src/client/components/NoSSR";
import { DisplayDelta, DisplayDate } from "src/client/components/TimeDisplay";
import ShopCardListItem from "./ShopCardListItem";
import ShopCardLimitedItem from "./ShopCardLimitedItem";

export default function ShopCard({ shopData, endsAt }) {
  const { inventory, limited, icon, color, ...cardProps } = shopData;
  const currency = expandAtlasUrl(icon);

  return (
    <Card
      {...cardProps}
      color={color == "green" ? 7 : 3 /* green || gold */}
      icon={currency}>
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
