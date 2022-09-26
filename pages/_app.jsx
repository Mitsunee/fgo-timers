import { useEffect } from "react";
import "modern-normalize/modern-normalize.css";

import "@styles/globals.css";
import { useRouterLoading } from "@utils/hooks/useRouterLoading";
import { useMediaQuery } from "@utils/hooks/useMediaQuery";
import { setMobileNavOpen } from "@stores/uiStore";
import Header from "@components/Header";
import Loading from "@components/Loading";
import Layout from "@components/Layout";
import Footer from "@components/Footer";
import SettingsMenu from "@components/SettingsMenu";

export default function App({ Component, pageProps }) {
  const loading = useRouterLoading();
  const isDesktop = useMediaQuery("large");

  // close mobile navigation when navigating or when screensize changes to desktop
  useEffect(() => {
    if (loading || isDesktop) setMobileNavOpen(false);
  }, [loading, isDesktop]);

  return (
    <>
      <Header />
      {loading ? (
        <Loading />
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
      <Footer />
      <SettingsMenu />
    </>
  );
}
