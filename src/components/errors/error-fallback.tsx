import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

interface ErrorFallbackProps {
  title?: string;
  message?: string;
  error?: Error;
  onReset?: () => void;
  showHomeButton?: boolean;
}

export function ErrorFallback({
  title = "Something went wrong",
  message,
  error,
  onReset,
  showHomeButton = true,
}: ErrorFallbackProps) {
  const errorMessage =
    message || error?.message || "An unexpected error occurred. Please try refreshing the page.";

  return (
    <div className="container mx-auto py-10 flex items-center justify-center min-h-[50vh]">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-accent-100 p-2">
              <AlertTriangle className="h-5 w-5 text-accent-600" />
            </div>
            <CardTitle>{title}</CardTitle>
          </div>
          <CardDescription className="mt-2">{errorMessage}</CardDescription>
        </CardHeader>
        {process.env.NODE_ENV === "development" && error && (
          <CardContent>
            <details className="text-xs">
              <summary className="cursor-pointer font-medium text-muted-foreground hover:text-foreground">
                Error Details
              </summary>
              <pre className="mt-2 p-3 bg-muted rounded overflow-auto max-h-40 text-accent-600">
                {error.stack || error.message}
              </pre>
            </details>
          </CardContent>
        )}
        <CardFooter className="flex gap-2">
          {onReset && (
            <Button onClick={onReset} variant="default">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
          {showHomeButton && (
            <Link href="/">
              <Button variant="outline">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>
            </Link>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
