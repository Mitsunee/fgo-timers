import type { Shops } from "src/shops/types";
import { getBundledShops } from "src/utils/getBundles";
import { collectDataMaps } from "./collectDataMaps";

export function staticPropsFactory<T extends Shops>(shopName: T) {
  return async function getStaticProps() {
    const shops = await getBundledShops();
    const shop = shops[shopName];
    const maps = await collectDataMaps(shop);

    return { props: { shop, ...maps } };
  };
}
