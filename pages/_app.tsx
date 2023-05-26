import "modern-normalize/modern-normalize.css";
import "~/client/styles/app.css";

import { Dosis, Noto_Sans } from "@next/font/google";
import type { AppType } from "next/app";
import { api } from "~/client/api";
import { Layout } from "~/components/Layout";

const dosis = Dosis({
  weight: ["400", "700"],
  style: "normal",
  subsets: ["latin"],
  display: "swap"
});

const noto = Noto_Sans({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap"
});

const App: AppType = ({ Component, pageProps }) => {
  return (
    <Layout>
      <style jsx global>
        {`
          :root {
            --sans: ${noto.style.fontFamily};
            --title: ${dosis.style.fontFamily};
          }
        `}
      </style>
      <Component {...pageProps} />
    </Layout>
  );
};

export default api.withTRPC(App);
