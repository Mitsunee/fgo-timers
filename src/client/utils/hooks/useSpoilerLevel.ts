import { useStore } from "@nanostores/react";
import { settingsMap } from "~/client/stores/settingsStore";
import { useIsClient } from "~/hooks/useIsClient";
import { SpoilerLevels } from "~/types/enum";

const subKeys = { keys: ["showSpoiler" as const] };

/**
 * SSR-safe subscription to the current Spoiler Level setting. Returns `SpoilerLevels.PRERENDER` during SSR and Hydration.
 * @returns Current Spoiler level
 */
export function useSpoilerLevel(): SpoilerLevels {
  const isClient = useIsClient();
  const { showSpoiler } = useStore(settingsMap, subKeys);
  return isClient ? showSpoiler : SpoilerLevels.PRERENDER;
}
