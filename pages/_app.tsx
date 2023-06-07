import "modern-normalize/modern-normalize.css";
import "~/client/styles/app.css";

import { useLayoutEffect as _useLayoutEffect } from "react";
import { Dosis, Noto_Sans } from "@next/font/google";
import type { AppType } from "next/app";
import { api } from "~/client/api";
import { Layout } from "~/components/Layout";
import { setIsClient } from "~/hooks/useIsClient";

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

// HACK: Dear React, there is not reason to have a warning thrown on every render
//       that useLayoutEffect does nothing on the server, that's the entire
//       point of me using that hook in particular.
const useLayoutEffect: typeof _useLayoutEffect =
  typeof document === "undefined" ? () => undefined : _useLayoutEffect;

const App: AppType = ({ Component, pageProps }) => {
  useLayoutEffect(() => {
    // set background
    const bg = Math.ceil((Math.random() * 100) % 17)
      .toString()
      .padStart(2, "0");
    document.body.style.setProperty(
      "--landing-bg",
      `url("/assets/backgrounds/landing/${bg}.jpg")`
    );
    document.body.classList.add("with-bg");

    // set isClient
    setIsClient();
  }, []);

  return (
    <>
      <style jsx global>
        {`
          :root {
            --sans: ${noto.style.fontFamily};
            --title: ${dosis.style.fontFamily};
          }
        `}
      </style>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
};

export default api.withTRPC(App);
