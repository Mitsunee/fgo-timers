import { parsePrismShopData } from "../utils/parsePrismShopData";

export async function generatePrismShopData() {
  const [mpShop, rpShop] = await Promise.all([
    parsePrismShopData("assets/data/manaPrismShop.yml"),
    parsePrismShopData("assets/data/rarePrismShop.yml")
  ]);

  return { mpShop, rpShop };
}
