import { useEffect } from "react";
import "modern-normalize/modern-normalize.css";

import "@styles/globals.css";
import { useRouterLoading } from "@utils/hooks/useRouterLoading";
import { useMediaQuery } from "@utils/hooks/useMediaQuery";
import { setMobileNavOpen } from "@stores/uiStore";
import Layout from "@components/Layout";

export default function App({ Component, pageProps }) {
  const loading = useRouterLoading();
  const isDesktop = useMediaQuery("large");

  // close mobile navigation when navigating or when screensize changes to desktop
  useEffect(() => {
    if (loading || isDesktop) setMobileNavOpen(false);
  }, [loading, isDesktop]);

  return (
    <Layout loading={loading}>
      <Component {...pageProps} />
    </Layout>
  );
}
