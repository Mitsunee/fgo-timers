import "modern-normalize/modern-normalize.css";

import "@styles/globals.css";
import { useRouterLoading } from "@utils/hooks/useRouterLoading";
import { useThemeBreakpoint } from "@utils/hooks/useThemeBreakpoint";
import Header from "@components/Header";
import Loading from "@components/Loading";

function MyApp({ Component, pageProps }) {
  const loading = useRouterLoading();
  const [currentBreakpoint, breakpoints] = useThemeBreakpoint();

  return (
    <>
      <Header isMobile={currentBreakpoint < breakpoints[1]} />
      {loading ? <Loading /> : <Component {...pageProps} />}
    </>
  );
}

export default MyApp;
