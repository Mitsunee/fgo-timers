import type { z } from "zod";
import type { ShopSchema } from "~/schema/ShopSchema";

type ParsedShop = z.output<typeof ShopSchema>;
export interface BundledShop extends ParsedShop {
  slug: string;
}
