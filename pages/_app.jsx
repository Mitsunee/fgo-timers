import "modern-normalize/modern-normalize.css";
import "@styles/globals.css";

import { useRouterLoading } from "@utils/hooks/useRouterLoading";
import Loading from "@components/Loading";

function MyApp({ Component, pageProps }) {
  const loading = useRouterLoading();

  return <>{loading ? <Loading /> : <Component {...pageProps} />}</>;
}

export default MyApp;
