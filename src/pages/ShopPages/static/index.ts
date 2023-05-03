import type { GetStaticPaths, GetStaticProps } from "next";
import type { ParsedUrlQuery } from "querystring";
import type { WithMaps } from "src/client/contexts";
import type { BundledShop } from "src/schema/ShopSchema";
import { getBundledShops } from "src/utils/getBundles";
import { collectDataMaps } from "./collectDataMaps";

export interface PageContext extends ParsedUrlQuery {
  slug: string;
}

export interface ShopPageProps
  extends WithMaps<"items" | "servants" | "ces" | "ccs" | "mcs"> {
  shop: BundledShop; // TODO: add "next" prop to monthly shop inventories?
}

export const getStaticPaths: GetStaticPaths<PageContext> = async () => {
  const shops = await getBundledShops();
  const paths = shops.map(shop => ({ params: { slug: shop.slug } }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<
  ShopPageProps,
  PageContext
> = async ({ params }) => {
  if (!params) throw new Error("Expected params in ShopPage");
  const slug = params.slug;
  const shops = await getBundledShops();
  const shop = shops.find(shop => shop.slug == slug);
  if (!shop) throw new Error(`Could not find shop with slug '${slug}'`);
  const maps = await collectDataMaps(shop);

  return {
    props: { shop, ...maps }
  };
};
