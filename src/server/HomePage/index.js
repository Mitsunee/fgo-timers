import { generateBackgroundList } from "./generateBackgroundList";
import { generateEventData } from "./generateEventData";

export async function getStaticProps() {
  const backgrounds = await generateBackgroundList();
  const events = await generateEventData();

  /* TODO: rewrite other HomePage properties
   - tickets
   - itemData
   - mpShopData
   - rpShopData
  */

  return {
    props: { backgrounds, events },
    revalidate: 60
  };
}
