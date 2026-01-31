import { type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
}

/**
 * Displays a single statistic with an icon, value, and label
 */
export const StatCard = ({ icon: Icon, label, value }: StatCardProps) => {
  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
};
