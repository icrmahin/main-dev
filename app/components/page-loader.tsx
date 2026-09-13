"use client";

import { useState, useCallback } from "react";
import Loading from "./loading";

export default function PageLoader() {
  const [loaded, setLoaded] = useState(false);

  const handleComplete = useCallback(() => {
    setLoaded(true);
  }, []);

  if (loaded) return null;

  return <Loading onComplete={handleComplete} />;
}
