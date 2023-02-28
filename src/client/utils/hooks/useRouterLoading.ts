import Router from "next/router";
import { useState, useEffect } from "react";

/**
 * Subscribes to router loading state. `true` while router is currently loading, `false` otherwise.
 * @returns boolean
 */
export const useRouterLoading = () => {
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const start = () => setLoading(true);
    const end = () => setLoading(false);
    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);
    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
    };
  }, []);
  return loading;
};
