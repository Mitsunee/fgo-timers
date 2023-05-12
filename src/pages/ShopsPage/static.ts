import { pickByKey } from "@foxkit/util/object";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import type { BundledShop } from "src/schema/ShopSchema";
import { getBundledItemMap, getBundledShops } from "src/utils/getBundles";
import { Log } from "src/utils/log";

export const getStaticProps = async function () {
  const [itemMap, shops] = await Promise.all([
    getBundledItemMap(),
    getBundledShops()
  ]);
  const items: typeof itemMap = {};

  [3, 18, 46, 80059].forEach(id => {
    items[id] = itemMap[id];
  });

  const mpShop = shops.find(
    shop => shop.slug == "mana-prism" && shop.monthly && shop.monthly.length > 0
  ) as NonNullableKey<BundledShop, "monthly">;
  const rpShop = shops.find(
    shop => shop.slug == "rare-prism" && shop.monthly && shop.monthly.length > 0
  ) as NonNullableKey<BundledShop, "monthly">;

  if (!mpShop) {
    Log.error("Could not find MP Shop data");
    throw new Error("Could not find MP Shop data");
  }

  if (!rpShop) {
    Log.error("Could not find RP Shop data");
    throw new Error("Could not find RP Shop data");
  }

  const resets = {
    mp: pickByKey(mpShop.monthly[0], ["day", "hour"]),
    rp: pickByKey(rpShop.monthly[0], ["day", "hour"])
  } as const;

  return { props: { items, resets } };
} satisfies GetStaticProps;

export type ShopsPageProps = InferGetStaticPropsType<typeof getStaticProps>;
