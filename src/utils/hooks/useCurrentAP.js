import { useState, useEffect } from "react";

export function useCurrentAP({ apAtStart, offsetTime, startTime }, interval) {
  const [currentAp, setCurrentAp] = useState(0);

  useEffect(() => {
    const currentTime = Math.floor(interval / 1000);
    const delta = currentTime - startTime - offsetTime;
    const apDelta = delta >= 300 ? Math.floor(delta / 300) : 0;
    setCurrentAp(apAtStart + apDelta);
  }, [interval, startTime, offsetTime, apAtStart]);

  return currentAp;
}
