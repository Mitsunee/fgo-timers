import type { MixedShop, Shop } from "../schema/ShopSchema";

type ShopIndex = { path: string; isMixed?: boolean };

export const ShopsIndex = {
  "mana-prism": { path: "assets/data/shops/mana-prism.yml" },
  "rare-prism": { path: "assets/data/shops/rare-prism.yml" },
  "pure-prism": { path: "assets/data/shops/pure-prism.yml" }
} satisfies Record<string, ShopIndex>;

export type Shops = keyof typeof ShopsIndex;

export type BundledShops = {
  [Key in Shops]: (typeof ShopsIndex)[Key] extends { isMixed: true }
    ? MixedShop
    : Shop;
};

export type AnyShopItem = Shop["inventory"][number] &
  Partial<NonNullable<Shop["limited"]>[number]> &
  Partial<MixedShop["inventory"][number]> &
  Partial<NonNullable<MixedShop["limited"]>[number]>;

export type AnyShop = Omit<
  MixedShop & Partial<Shop>,
  "inventory" | "monthly" | "limited"
> & {
  inventory: AnyShopItem[];
  monthly?: AnyShopItem[];
  limited?: AnyShopItem[];
};
