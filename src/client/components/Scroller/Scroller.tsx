import { ElementRef, useLayoutEffect, useRef } from "react";
import { useStore } from "@nanostores/react";
import {
  settingsStore,
  toggleInfiniteScrollMode
} from "src/client/stores/settingsStore";
import { ActionButton } from "src/client/components/Button";

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
  height?: Height;
  handler: Handler;
  handlerMax?: Handler;
}

/**
 * Handles infinite scrolling with a ScrollBoundary component.
 */
export function Scroller({ height = 100, handler, handlerMax }: ScrollerProps) {
  const { autoInfiniteScroll } = useStore(settingsStore);

  if (!autoInfiniteScroll)
    return (
      <>
        <ActionButton onClick={handler}>Show more</ActionButton>{" "}
        {handlerMax && (
          <>
            <ActionButton onClick={handlerMax}>Show all</ActionButton>{" "}
          </>
        )}
        <ActionButton
          onClick={() => toggleInfiniteScrollMode(true)}
          title="Activates the Automatic Infinite Scrolling option in the Settings Menu">
          Show more automatically
        </ActionButton>
      </>
    );
  return <ScrollBoundary height={height} handler={handler} />;
}
