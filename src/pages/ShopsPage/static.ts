import { pickByKey } from "@foxkit/util/object";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { createItemRecord } from "~/static/data/items";
import { getBundledShops } from "~/static/shops";
import { Log } from "~/utils/log";
import type { BundledShop } from "~/shops/types";

export const getStaticProps = async function () {
  const [shops, items] = await Promise.all([
    getBundledShops(),
    createItemRecord(new Set<number>([3, 18, 46, 80059]))
  ]);

  const mpShop = shops.find(
    shop => shop.slug == "mana-prism" && shop.monthly && shop.monthly.length > 0
  ) as NonNullableKey<BundledShop, "monthly">;
  const rpShop = shops.find(
    shop => shop.slug == "rare-prism" && shop.monthly && shop.monthly.length > 0
  ) as NonNullableKey<BundledShop, "monthly">;

  if (!mpShop) {
    Log.throw("Could not find MP Shop data");
  }

  if (!rpShop) {
    Log.throw("Could not find RP Shop data");
  }

  const resets = {
    mp: pickByKey(mpShop.monthly[0], ["day", "hour"]),
    rp: pickByKey(rpShop.monthly[0], ["day", "hour"])
  } as const;

  return { props: { items, resets } };
} satisfies GetStaticProps;

export type ShopsPageProps = InferGetStaticPropsType<typeof getStaticProps>;
