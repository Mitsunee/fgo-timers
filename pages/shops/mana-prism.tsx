import type { InferGetStaticPropsType } from "next";
import { staticPropsFactory } from "src/pages/ShopPages/static";
import { DataContext } from "src/client/contexts";

export const getStaticProps = staticPropsFactory("mana-prism");
type PageProps = InferGetStaticPropsType<typeof getStaticProps>;

export default function ManaPrismShopPage(props: PageProps) {
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
