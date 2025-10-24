import { EmptyBounties } from "@/components/common";

export default function AssignedTab({ params: _params }: { params: Promise<{ pubkey: string }> }) {
  return (
    <div className="space-y-4">
      <EmptyBounties />
    </div>
  );
}
