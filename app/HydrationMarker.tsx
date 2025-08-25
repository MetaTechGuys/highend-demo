"use client";

import { useEffect } from "react";

export default function HydrationMarker() {
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-hydrated", "true");
    }
  }, []);
  return null;
}
