import { useState, useEffect } from "react";
import { useStore } from "@nanostores/react";

import { useIsClient } from "@utils/hooks/useIsClient";
import { clientStore } from "@stores/clientStore";

export const useFooterFixed = () => {
  const [footerFixed, setFooterFixed] = useState(false);
  const { height } = useStore(clientStore);
  const isClient = useIsClient();

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (isClient) {
      const [el] = document.getElementById("__next").getClientRects();
      setFooterFixed(el.height < height);
    }
  });

  return footerFixed;
};
