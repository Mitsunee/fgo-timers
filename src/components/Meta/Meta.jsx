import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

//import styles from "./Meta.module.css";
import { setPageMeta } from "@stores/metaStore";

const prefix = " - FGO Timers";

export default function Meta({
  title,
  description,
  image = false,
  noTitleSuffix = false,
  headerTitle = null,
  headerDescription = null,
  color = "#2e2c6a",
  isError = false
}) {
  const router = useRouter();

  useEffect(() => {
    setPageMeta({
      title: headerTitle ?? title,
      description: headerDescription ?? description
    });
  }, [headerTitle, title, headerDescription, description]);

  return (
    <Head>
      <title>{`${title}${noTitleSuffix ? "" : prefix}`}</title>
      <meta
        name="twitter:title"
        content={`${title}${noTitleSuffix ? "" : prefix}`}
      />
      <meta
        property="og:title"
        content={`${title}${noTitleSuffix ? "" : prefix}`}
      />
      <meta name="application-name" content="FGO Timers" />
      <meta property="og:site_name" content="FGO Timers" />
      <meta name="description" content={description} />
      <meta name="twitter:description" content={description} />
      <meta property="og:description" content={description} />
      <meta name="twitter:author" content="@Mitsunee" />
      {image && <meta name="twitter:card" content="summary_large_image" />}
      <meta
        name="twitter:image"
        content={`${
          process.env.NEXT_PUBLIC_DOMAIN
            ? `https://${process.env.NEXT_PUBLIC_DOMAIN}`
            : ""
        } + ${image || "/icon-64.png"}`}
      />
      <meta
        property="og:image"
        content={`${
          process.env.NEXT_PUBLIC_DOMAIN
            ? `https://${process.env.NEXT_PUBLIC_DOMAIN}`
            : ""
        } + ${image || "/icon-64.png"}`}
      />
      {process.env.NEXT_PUBLIC_DOMAIN && (
        <link
          rel="canonical"
          href={`https://${process.env.NEXT_PUBLIC_DOMAIN}${router.asPath}`}
        />
      )}
      <meta name="theme-color" content={color} />
      {isError && <meta name="robots" content="noindex,noarchive,none" />}
    </Head>
  );
}
