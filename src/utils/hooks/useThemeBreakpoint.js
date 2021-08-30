import { useState, useEffect } from "react";
import { useStore } from "nanostores/react";

import theme from "@styles/theme";
import { clientStore } from "@stores/clientStore";

const breakpoints = [
  0,
  ...theme.breakpoints.map(breakpoint => +breakpoint.slice(0, -2))
];

export const useThemeBreakpoint = () => {
  const [currentBreakpoint, setCurrentBreakpoint] = useState(0);
  const { width } = useStore(clientStore);

  useEffect(() => {
    const validBreakpoints = breakpoints.filter(
      breakpoint => breakpoint <= width
    );
    const newBreakpoint = Math.max(...validBreakpoints);
    setCurrentBreakpoint(newBreakpoint);
  }, [width]);

  return [currentBreakpoint, breakpoints];
};
