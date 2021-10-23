import { useState, useEffect } from "react";
import { useStore } from "nanostores/react";

import { settingsStore } from "@stores/settingsStore";

export function usePaginationSlice(elements, page) {
  const { perPage } = useStore(settingsStore);
  const [out, setOut] = useState([0, 0]);

  useEffect(() => {
    const pageIdx = page - 1;
    const start = pageIdx * perPage;
    const end = Math.min(elements, (pageIdx + 1) * perPage);
    setOut([start, end]);
  }, [elements, page, perPage]);

  return out;
}
