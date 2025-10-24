import { Separator } from "@/components/ui/separator";

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  showSeparator?: boolean;
}

export function SectionHeader({
  title,
  description,
  action,
  showSeparator = false,
}: SectionHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      {showSeparator && <Separator />}
    </div>
  );
}
