import { useState, useEffect, useRef } from "react";
import { useStore } from "@nanostores/react";

import { clientStore } from "@stores/clientStore";

function makeObserver(fn) {
  try {
    return new ResizeObserver(fn);
  } catch {
    return null;
  }
}

export const useFooterFixed = () => {
  const [footerFixed, setFooterFixed] = useState(true);
  const [nextHeight, setNextHeight] = useState(0);
  const { height: windowHeight } = useStore(clientStore);
  const observerRef = useRef(
    makeObserver(([entry]) => setNextHeight(entry.contentRect.height))
  );

  // mount observer
  useEffect(() => {
    const { current: observer } = observerRef;
    if (observer.current === null || typeof document === "undefined") return;

    observer.observe(document.querySelector("#__next"));

    // Remove the observer as soon as the component is unmounted
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setFooterFixed(nextHeight <= windowHeight);
  }, [nextHeight, windowHeight]);

  return footerFixed;
};
