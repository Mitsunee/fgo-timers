import type { GetStaticPropsResult, InferGetStaticPropsType } from "next";
import * as Legacy from "src/server/HomePage";
import { getEventProps } from "./getEventProps";

export const getStaticProps = async () => {
  const [legacyProps, events] = await Promise.all([
    Legacy.getStaticProps(),
    getEventProps()
  ]);

  const props = { ...legacyProps, events };
  const res: GetStaticPropsResult<typeof props> = { props, revalidate: 3600 };
  return res;
};

export type HomePageProps = InferGetStaticPropsType<typeof getStaticProps>;
