import type { AppProps } from "next/app";
import "modern-normalize/modern-normalize.css";
import "src/client/styles/app.css";
import { Layout } from "src/client/components/Layout";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
