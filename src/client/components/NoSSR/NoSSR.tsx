import { useIsClient } from "src/client/utils/hooks/useIsClient";

export default function NoSSR({ children }: React.PropsWithChildren) {
  const isClient = useIsClient();

  return <>{isClient ? children : null}</>;
}
