import type { PropsWithChildren } from "react";
import { useIsClient } from "src/client/utils/hooks/useIsClient";

export default function NoSSR({ children }: PropsWithChildren) {
  const isClient = useIsClient();

  return <>{isClient ? children : null}</>;
}
