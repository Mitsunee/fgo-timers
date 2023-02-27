import { useStore } from "@nanostores/react";
import { settingsMap } from "src/client/stores/settingsStore";
import { useIsClient } from "src/client/utils/hooks/useIsClient";
import { SpoilerLevels } from "src/types/enum";

const subKeys = { keys: ["showSpoiler" as const] };
export function useSpoilerLevel(): SpoilerLevels {
  const isClient = useIsClient();
  const { showSpoiler } = useStore(settingsMap, subKeys);
  return isClient ? showSpoiler : SpoilerLevels.PRERENDER;
}
