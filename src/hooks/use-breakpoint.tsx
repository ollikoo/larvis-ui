import { useLayoutEffect, useState } from "react";
import { debounce } from "remeda";
import { getBreakpoint } from "../utils/breakpoints";

/**
 * Hook to get current breakpoint
 */
export const useBreakpoint = () => {
  const [width, setWidth] = useState<number>(window.innerWidth);
  useLayoutEffect(() => {
    const updateSize = debounce(
      () => {
        setWidth(window.innerWidth);
      },
      { waitMs: 150 },
    );

    window.addEventListener("resize", updateSize.call);
    updateSize.call();
    return () => {
      window.removeEventListener("resize", updateSize.call);
      updateSize.cancel();
    };
  }, []);

  return getBreakpoint(width);
};
