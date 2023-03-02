import "modern-normalize/modern-normalize.css";
import type { AppType } from "next/app";
import { Dosis, Noto_Sans } from "@next/font/google";
import "src/client/styles/app.css";
import { Layout } from "src/client/components/Layout";
import { api } from "src/client/api";

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
