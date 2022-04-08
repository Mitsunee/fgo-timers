import { useIsClient } from "@utils/hooks/useIsClient";

export default function NoSSR({ children }) {
  const isClient = useIsClient();

  return <>{isClient ? children : null}</>;
}
