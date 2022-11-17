import { useStore } from "@nanostores/react";
import { setSpoilerLevel, settingsMap } from "@stores/settingsStore";
import { useEffect, useState } from "react";
import { SpoilerLevels } from "src/types/enum";

export function useSpoilerLevel() {
  const [level, setLevel] = useState<SpoilerLevels>(SpoilerLevels.PRERENDER);
  const { showSpoiler } = useStore(settingsMap, { keys: ["showSpoiler"] });

  useEffect(() => {
    if (typeof document === "undefined") return;
    setLevel(showSpoiler);
  }, [showSpoiler]);

  return [level, setSpoilerLevel] as [SpoilerLevels, typeof setSpoilerLevel];
}
