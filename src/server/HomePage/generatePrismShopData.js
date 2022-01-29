import { parsePrismShopData } from "../utils/parsePrismShopData";

export async function generatePrismShopData() {
  const [mpShopData, rpShopData] = await Promise.all([
    parsePrismShopData("assets/data/manaPrismShop.yml"),
    parsePrismShopData("assets/data/rarePrismShop.yml")
  ]);

  return { mpShopData, rpShopData };
}
