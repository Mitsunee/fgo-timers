import { DataContext } from "~/client/contexts";
import Headline from "~/components/Headline";
import Meta from "~/components/Meta";
import { ShopInventorySection } from "~/pages/ShopPages/components/ShopInventorySection";
import { BorderColours } from "~/types/borders";
import type { ShopPageProps } from "~/pages/ShopPages/static";

export { getStaticProps, getStaticPaths } from "~/pages/ShopPages/static";

export default function ShopPage({
  servants,
  items,
  ces,
  ccs,
  mcs,
  costumes,
  shop
}: ShopPageProps) {
  const hasTimers = Boolean(shop.limited || shop.monthly);
  const hasBothTimers = Boolean(shop.limited && shop.monthly);
  const desc = `Items available in ${shop.title}${
    hasTimers
      ? ` and timers for ${shop.monthly ? "monthly " : ""}${
          hasBothTimers ? "and " : ""
        }${shop.limited ? "limited " : ""}shop${hasBothTimers ? "s" : ""}`
      : ""
  }`;
  const themeColor = BorderColours[shop.color];

  return (
    <DataContext
      servants={servants}
      items={items}
      ces={ces}
      ccs={ccs}
      mcs={mcs}
      costumes={costumes}>
      <Meta
        title={`${shop.title} | Shops | FGO Timers`}
        headerTitle="Shops"
        description={desc}
        color={themeColor}
      />
      <Headline id="inventory">{shop.title}</Headline>
      <ShopInventorySection inventories={shop.inventory} color={shop.color} />
      {shop.monthly && (
        <>
          <Headline id="monthly-inventory">
            Monthly Inventor{shop.monthly.length > 1 ? "ies" : "y"}
          </Headline>
          <ShopInventorySection inventories={shop.monthly} color={shop.color} />
        </>
      )}
      {shop.limited && shop.limited.length > 0 && (
        <>
          <Headline id="limited-inventory">
            Limited Time Inventor{shop.limited.length > 1 ? "ies" : "y"}
          </Headline>
          <ShopInventorySection inventories={shop.limited} color={shop.color} />
        </>
      )}
    </DataContext>
  );
}
