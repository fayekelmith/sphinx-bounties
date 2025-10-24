"use client";

import { use, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ProfileHeader, ProfileStats } from "@/components/users";
import { useGetUser } from "@/hooks/queries";
import { useAuth } from "@/hooks/use-auth";

export default function ProfileLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ pubkey: string }>;
}) {
  const { pubkey } = use(params);
  const pathname = usePathname();
  const { user: currentUser } = useAuth();

  const { data: user, isLoading, error } = useGetUser(pubkey);

  if (error) throw error;
  if (isLoading || !user) {
    return <div>Loading...</div>;
  }

  const isOwnProfile = currentUser?.pubkey === pubkey;

  const tabs = [
    { name: "About", path: `/people/${pubkey}` },
    { name: "Bounties Created", path: `/people/${pubkey}/bounties` },
    { name: "Assigned Tasks", path: `/people/${pubkey}/assigned` },
    { name: "Workspaces", path: `/people/${pubkey}/workspaces` },
  ];

  const stats = {
    totalEarned: 0,
    bountiesCompleted: user._count?.assignedBounties || 0,
    bountiesCreated: user._count?.createdBounties || 0,
    successRate: 0,
  };

  return (
    <div className="space-y-6">
      <ProfileHeader user={user} isOwnProfile={isOwnProfile} />

      <ProfileStats stats={stats} />

      <div className="border-b">
        <nav className="flex gap-1">
          {tabs.map((tab) => {
            const isActive = pathname === tab.path;
            return (
              <Link
                key={tab.path}
                href={tab.path}
                className={`px-4 py-3 border-b-2 font-medium transition-colors ${
                  isActive
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div>{children}</div>
    </div>
  );
}
