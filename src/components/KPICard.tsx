import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
}

const KPICard = ({ title, value, icon: Icon, description }: KPICardProps) => {
  return (
    <Card className="card-gradient shadow-card hover:shadow-card-hover transition-smooth overflow-hidden border-border/50">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </div>
      <div className="h-1 w-full bg-gradient-to-r from-primary to-secondary" />
    </Card>
  );
};

export default KPICard;
