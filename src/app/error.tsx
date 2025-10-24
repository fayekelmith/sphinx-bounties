"use client";

import { useEffect } from "react";
import { ErrorFallback } from "@/components/errors";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  return <ErrorFallback error={error} onReset={reset} />;
}
