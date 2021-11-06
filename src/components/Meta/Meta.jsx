import Head from "next/head";
import { useEffect } from "react";

//import styles from "./Meta.module.css";
import { setPageMeta } from "@stores/metaStore";

export default function Meta({
  title,
  description,
  image = false,
  noTitleSuffix = false,
  headerTitle = null,
  headerDescription = null
}) {
  useEffect(() => {
    setPageMeta({
      title: headerTitle ?? title,
      description: headerDescription ?? description
    });
  }, [headerTitle, title, headerDescription, description]);

  return (
    <Head>
      <title>{`${title}${noTitleSuffix ? "" : " - FGO Tools"}`}</title>
      <meta
        name="twitter:title"
        content={`${title}${noTitleSuffix ? "" : " - FGO Tools"}`}
      />
      <meta
        property="og:title"
        content={`${title}${noTitleSuffix ? "" : " - FGO Tools"}`}
      />
      <meta property="og:site_name" content="FGO Tools" />
      <meta name="description" content={description} />
      <meta name="twitter:description" content={description} />
      <meta property="og:description" content={description} />
      {image && (
        <>
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:author" content="@Mitsunee" />
          <meta
            name="twitter:image"
            content={
              (process.env.NEXT_PUBLIC_DOMAIN
                ? `https://${process.env.NEXT_PUBLIC_DOMAIN}`
                : "") + image
            }
          />
          <meta
            property="og:image"
            content={
              (process.env.NEXT_PUBLIC_DOMAIN
                ? `https://${process.env.NEXT_PUBLIC_DOMAIN}`
                : "") + image
            }
          />
        </>
      )}
      {process.env.NEXT_PUBLIC_DOMAIN && (
        <link
          rel="canonical"
          // TODO: put path from router into canonical meta tag
          href={`https://${process.env.NEXT_PUBLIC_DOMAIN}/`}
        />
      )}
    </Head>
  );
}
