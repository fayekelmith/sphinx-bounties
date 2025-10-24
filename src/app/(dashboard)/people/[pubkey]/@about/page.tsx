"use client";

import { use } from "react";
import { useGetUser } from "@/hooks/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, Code, Briefcase, Calendar } from "lucide-react";

export default function AboutTab({ params }: { params: Promise<{ pubkey: string }> }) {
  const { pubkey } = use(params);
  const { data: user, isLoading } = useGetUser(pubkey);

  if (isLoading || !user) {
    return <div>Loading...</div>;
  }

  const joinedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const lastLoginDate = user.lastLogin
    ? new Date(user.lastLogin).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Never";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            {user.description ? (
              <p className="text-muted-foreground leading-relaxed">{user.description}</p>
            ) : (
              <p className="text-muted-foreground italic">No bio provided yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lightning Wallet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {user.contactKey ? (
              <>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Contact Key</p>
                  <code className="text-xs bg-muted p-2 rounded block break-all">
                    {user.contactKey}
                  </code>
                </div>
                {user.routeHint && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Route Hint</p>
                    <code className="text-xs bg-muted p-2 rounded block break-all">
                      {user.routeHint}
                    </code>
                  </div>
                )}
              </>
            ) : (
              <p className="text-muted-foreground italic">No lightning wallet connected.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary-100 p-2">
                <Briefcase className="h-4 w-4 text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-medium">{user._count?.createdWorkspaces || 0}</p>
                <p className="text-xs text-muted-foreground">Workspaces Owned</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary-100 p-2">
                <Code className="h-4 w-4 text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-medium">{user._count?.memberships || 0}</p>
                <p className="text-xs text-muted-foreground">Workspace Memberships</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary-100 p-2">
                <Wallet className="h-4 w-4 text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-medium">{user._count?.submittedProofs || 0}</p>
                <p className="text-xs text-muted-foreground">Proofs Submitted</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary-100 p-2">
                <Calendar className="h-4 w-4 text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-medium">{joinedDate}</p>
                <p className="text-xs text-muted-foreground">Joined</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary-100 p-2">
                <Calendar className="h-4 w-4 text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-medium">{lastLoginDate}</p>
                <p className="text-xs text-muted-foreground">Last Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
