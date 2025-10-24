import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Home, Search, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container mx-auto py-10 flex items-center justify-center min-h-screen">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary-100 p-4">
              <FileQuestion className="h-12 w-12 text-primary-600" />
            </div>
          </div>
          <CardTitle className="text-3xl">404 - Page Not Found</CardTitle>
          <CardDescription className="mt-2 text-base">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            You may have mistyped the address or the page may have been removed.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button asChild>
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/bounties">
              <Search className="h-4 w-4 mr-2" />
              Browse Bounties
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
