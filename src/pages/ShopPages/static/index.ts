import type { GetStaticPaths, GetStaticProps } from "next";
import type { ParsedUrlQuery } from "querystring";
import { getBuildInfo } from "~/utils/getBuildInfo";
import { getBundledShops } from "~/utils/getBundles";
import { Log } from "~/utils/log";
import type { WithMaps } from "~/client/contexts";
import type { BundledShop } from "~/schema/ShopSchema";
import { collectDataMaps } from "./collectDataMaps";

export interface PageContext extends ParsedUrlQuery {
  slug: string;
}

export interface ShopPageProps
  extends WithMaps<"items" | "servants" | "ces" | "ccs" | "mcs" | "costumes"> {
  shop: BundledShop;
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

  // filter expired limited shops
  if (shop.limited) {
    const build = await getBuildInfo();
    const temp = shop.limited.length;
    shop.limited = shop.limited.filter(
      inventory => inventory.date[1] > build.date
    );
    if (temp > shop.limited.length) {
      Log.warn(`Limited inventories were filtered in '${slug}.yml'`);
    }
  }

  // get data maps
  const maps = await collectDataMaps(shop);

  return {
    props: { shop, ...maps }
  };
};
