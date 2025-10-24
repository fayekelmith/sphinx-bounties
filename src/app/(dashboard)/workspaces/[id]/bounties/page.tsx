import { EmptyBounties } from "@/components/common";

export default function WorkspaceBountiesPage({
  params: _params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="space-y-6">
      <EmptyBounties />
    </div>
  );
}
