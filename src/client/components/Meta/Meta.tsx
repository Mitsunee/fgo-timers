import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { setPageMeta } from "src/client/stores/metaStore";
import { hostUrl } from "src/utils/env";

interface MetaProps {
  title: string;
  description: string;
  image?: string;
  noTitleSuffix?: boolean;
  headerTitle?: string;
  headerDescription?: string;
  color?: string;
  isError?: boolean;
}

const prefix = " - FGO Timers";

export default function Meta({
  title,
  description,
  image,
  noTitleSuffix = false,
  headerTitle,
  headerDescription,
  color = "#2e2c6a",
  isError = false
}: MetaProps) {
  const router = useRouter();
  const imagePath = image
    ? `${image.startsWith("/") ? "" : "/"}${image}`
    : "/icon-64.png";
  const imageUrl = `${hostUrl}${imagePath}`;
  const pageTitle = `${title}${noTitleSuffix ? "" : prefix}`;

  useEffect(() => {
    setPageMeta({
      title: headerTitle ?? title,
      description: headerDescription ?? description
    });
  }, [headerTitle, title, headerDescription, description]);

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="twitter:title" content={pageTitle} />
      <meta property="og:title" content={pageTitle} />
      <meta name="application-name" content="FGO Timers" />
      <meta property="og:site_name" content="FGO Timers" />
      <meta name="description" content={description} />
      <meta name="twitter:description" content={description} />
      <meta property="og:description" content={description} />
      <meta name="twitter:author" content="@Mitsunee" />
      {image && <meta name="twitter:card" content="summary_large_image" />}
      <meta name="twitter:image" content={imageUrl} />
      <meta property="og:image" content={imageUrl} />
      <link rel="canonical" href={`${hostUrl}${router.asPath}`} />
      <meta name="theme-color" content={color} />
      {isError && <meta name="robots" content="noindex,noarchive,none" />}
    </Head>
  );
}
