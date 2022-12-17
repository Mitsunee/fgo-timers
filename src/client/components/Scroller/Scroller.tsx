import { ElementRef, useLayoutEffect, useRef } from "react";
import { useStore } from "@nanostores/react";
import { settingsStore } from "src/client/stores/settingsStore";
import type { RequiredChildren } from "src/types/ComponentProps";

type Handler = () => void;
type Height = React.CSSProperties["height"];

interface ScrollBoundaryProps {
  handler: Handler;
  height: Height;
}

function ScrollBoundary({ height, handler }: ScrollBoundaryProps) {
  const ref = useRef<ElementRef<"div"> | null>(null);

  useLayoutEffect(() => {
    if (typeof window === "undefined" || !ref.current) return;
    const div = ref.current;
    const cb: IntersectionObserverCallback = ([entry]) => {
      console.log("DEBUG", div);
      if (entry.isIntersecting) handler();
    };
    const opt: IntersectionObserverInit = {
      threshold: [0.5]
    };
    const observer = new IntersectionObserver(cb, opt);
    observer.observe(div);

    return () => observer.disconnect();
  }, [handler]);

  return <div ref={ref} style={{ height }} />;
}

interface ScrollerProps {
  children: RequiredChildren;
  height?: Height;
  handler: Handler;
}

/**
 * Handles infinite scrolling with a ScrollBoundary component.
 * children prop is used as fallback while autoInfiniteScroll is disabled
 */
export function Scroller({ children, height = 100, handler }: ScrollerProps) {
  const { autoInfiniteScroll } = useStore(settingsStore);

  if (!autoInfiniteScroll) return <>{children}</>;
  return <ScrollBoundary height={height} handler={handler} />;
}
