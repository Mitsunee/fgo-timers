import type { AppType } from "next/app";
import "modern-normalize/modern-normalize.css";
import "src/client/styles/app.css";
import { Layout } from "src/client/components/Layout";
import { api } from "src/client/api";

const App: AppType = ({ Component, pageProps }) => {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
};

export default api.withTRPC(App);
