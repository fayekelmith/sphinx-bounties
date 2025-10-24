import { EmptyBounties } from "@/components/common";

export default function BountiesTab({ params: _params }: { params: Promise<{ pubkey: string }> }) {
  return (
    <div className="space-y-4">
      <EmptyBounties />
    </div>
  );
}
