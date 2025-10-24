"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useGetBounty } from "@/hooks/queries/use-bounty-queries";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { BountyDetail } from "@/components/bounties/BountyDetail";
import { Button } from "@/components/ui/button";

export default function BountyModalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data, isLoading } = useGetBounty(id);

  const handleClose = () => {
    router.back();
  };

  return (
    <Dialog open onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        )}

        {data && (
          <div className="space-y-6">
            <BountyDetail bounty={data} showActions={false} />
            <div className="flex gap-3 pt-4 border-t">
              {data.status === "OPEN" && <Button className="flex-1">Claim Bounty</Button>}
              {data.status === "ASSIGNED" && <Button className="flex-1">Submit Work</Button>}
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
