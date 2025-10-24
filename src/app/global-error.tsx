"use client";

import { ErrorFallback } from "@/components/errors";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <ErrorFallback
          title="Critical Error"
          message="A critical error occurred. Please refresh the page."
          error={error}
          onReset={reset}
        />
      </body>
    </html>
  );
}
