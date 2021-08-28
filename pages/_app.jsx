import { useEffect } from "react";
import "modern-normalize/modern-normalize.css";

import "@styles/globals.css";
import { useRouterLoading } from "@utils/hooks/useRouterLoading";
import { useThemeBreakpoint } from "@utils/hooks/useThemeBreakpoint";
import { setMobileNavOpen } from "@stores/mobileNavState";
import Header from "@components/Header";
import Loading from "@components/Loading";
import Layout from "@components/Layout";

function MyApp({ Component, pageProps }) {
  const loading = useRouterLoading();
  const [currentBreakpoint, breakpoints] = useThemeBreakpoint();
  const isDesktop = currentBreakpoint > breakpoints[2];

  // close mobile navigation when navigating or when screensize changes to desktop
  useEffect(() => {
    if (loading || isDesktop) {
      setMobileNavOpen(false);
    }
  }, [loading, isDesktop]);

  return (
    <>
      <Header isMobile={currentBreakpoint < breakpoints[1]} />
      {loading ? (
        <Loading />
      ) : (
        <Layout isDesktop={isDesktop}>
          <Component {...pageProps} />
        </Layout>
      )}
    </>
  );
}

export default MyApp;
