import type { GetStaticProps } from "next";
import { DataContext } from "src/client/contexts";
import { getStaticProps as dynamicStaticProps } from "src/pages/ShopPages/static";
import type { ShopPageProps } from "src/pages/ShopPages/static";

export const getStaticProps: GetStaticProps<ShopPageProps> = async () =>
  dynamicStaticProps({ params: { slug: "mana-prism" } });

export default function ManaPrismShopPage(props: ShopPageProps) {
  return (
    <DataContext
      servants={props.servants}
      items={props.items}
      ces={props.ces}
      ccs={props.ccs}
      mcs={props.mcs}>
      {/* PLACEHOLDER */}
      SAMPLE TEXT
      <h1>DEBUG</h1>
      <code>
        <pre>{JSON.stringify(props.shop, null, 2)}</pre>
      </code>
    </DataContext>
  );
}
