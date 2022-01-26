import { generateEventData } from "./generateEventData";

export async function getStaticProps() {
  const events = await generateEventData();

  /* TODO: rewrite other HomePage properties
   - backgrounds
   - tickets
   - itemData
   - mpShopData
   - rpShopData
  */

  return { props: { events }, revalidate: 60 };
}
