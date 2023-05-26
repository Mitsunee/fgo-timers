import spacetime from "spacetime";
import { nextMonthlyOccurence } from "~/time/nextMonthlyOccurence";
import { getBundledShops } from "~/utils/getBundles";
import type { BundledShop } from "~/schema/ShopSchema";

type PickedMonthlyInventory = Pick<
  NonNullable<BundledShop["monthly"]>[number],
  "title" | "day" | "hour"
> & { next: number };
type PickedLimitedInventory = Pick<
  NonNullable<BundledShop["limited"]>[number],
  "title" | "date"
>;

export interface ShopInfo {
  title: string;
  slug: string;
  monthly?: PickedMonthlyInventory[];
  limited?: PickedLimitedInventory[];
}

export async function getShopInfoProps(now: number) {
  const shops = await getBundledShops();
  const s = spacetime(now);
  return shops
    .filter(shop => shop.monthly || shop.limited)
    .map(shop => {
      const info: ShopInfo = {
        title: shop.title,
        slug: shop.slug
      };

      if (shop.monthly) {
        info.monthly = shop.monthly.map(monthly => {
          const monthlyInfo: PickedMonthlyInventory = {
            day: monthly.day,
            hour: monthly.hour,
            next: nextMonthlyOccurence(s, monthly.day, monthly.hour)
          };

          if (monthly.title) monthlyInfo.title = monthly.title;

          return monthlyInfo;
        });
      }

      if (shop.limited) {
        const limitedFiltered = shop.limited.filter(
          limited => now <= limited.date[1]
        );

        if (limitedFiltered.length > 0) {
          info.limited = limitedFiltered.map(limited => {
            const limitedInfo: PickedLimitedInventory = {
              date: limited.date
            };

            if (limited.title) limitedInfo.title = limited.title;

            return limitedInfo;
          });
        }
      }

      return info;
    });
}
