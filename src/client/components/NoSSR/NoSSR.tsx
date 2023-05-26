import { useIsClient } from "~/client/utils/hooks/useIsClient";

export function NoSSR({ children }: React.PropsWithChildren) {
  const isClient = useIsClient();

  return <>{isClient ? children : null}</>;
}
