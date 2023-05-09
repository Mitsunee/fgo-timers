import { DataContext } from "src/client/contexts";
import Meta from "src/client/components/Meta";
import type { ShopPageProps } from "src/pages/ShopPages/static";
import { BorderColours } from "src/types/borders";
import Headline from "@components/Headline";
import { ShopInventorySection } from "src/pages/ShopPages/components/ShopInventorySection";

export { getStaticProps, getStaticPaths } from "src/pages/ShopPages/static";

export default function ShopPage({
  servants,
  items,
  ces,
  ccs,
  mcs,
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
      mcs={mcs}>
      <Meta
        title={`${shop.title} | Shops | FGO Timers`}
        headerTitle="Shops"
        description={desc}
        color={themeColor}
      />
      <Headline>{shop.title}</Headline>
      <ShopInventorySection inventories={shop.inventory} color={shop.color} />
      {shop.monthly && (
        <>
          <Headline>
            Monthly Inventor{shop.monthly.length > 1 ? "ies" : "y"}
          </Headline>
          <ShopInventorySection inventories={shop.monthly} color={shop.color} />
        </>
      )}
      {shop.limited && shop.limited.length > 0 && (
        <>
          <Headline>
            Limited Time Inventor{shop.limited.length > 1 ? "ies" : "y"}
          </Headline>
          <ShopInventorySection inventories={shop.limited} color={shop.color} />
        </>
      )}
      {/* PLACEHOLDER */}
      <Headline>DEBUG</Headline>
      <code>
        <pre>{JSON.stringify(shop, null, 2)}</pre>
      </code>
    </DataContext>
  );
}
