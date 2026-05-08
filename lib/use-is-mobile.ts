"use client";

import { useEffect, useState } from "react";

/**
 * Returns true when the viewport width is ≤ 768px.
 * SSR-safe: defaults to false on the server so heavy
 * effects can be skipped on mobile after hydration.
 */
export function useIsMobile(breakpoint = 768): boolean {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    setMobile(mq.matches);

    const handler = (e: MediaQueryListEvent) => setMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [breakpoint]);

  return mobile;
}
