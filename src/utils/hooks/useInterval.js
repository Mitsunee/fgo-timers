import { useState, useEffect } from "react";

function _makeTimestamp(precision) {
  const timestamp = Date.now();

  if (precision) {
    return Math.floor(timestamp / Math.pow(10, precision));
  }

  return timestamp;
}

export function useInterval(intervalLength, precision) {
  const [lastUpdated, setLastUpdated] = useState(_makeTimestamp(precision));

  useEffect(() => {
    const update = () => setLastUpdated(_makeTimestamp(precision));
    const interval = setInterval(update, intervalLength);
    return () => clearInterval(interval);
  }, [intervalLength, precision]);

  return lastUpdated;
}
