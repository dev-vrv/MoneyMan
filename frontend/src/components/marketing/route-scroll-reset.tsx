"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function RouteScrollReset() {
  const pathname = usePathname();

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [pathname]);

  return null;
}
