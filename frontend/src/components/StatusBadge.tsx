import { cn } from '@/lib/utils';
import { OrderStatus } from '@/data/types';

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-warning/15 text-warning border-warning/30' },
  confirmed: { label: 'Confirmed', className: 'bg-info/15 text-info border-info/30' },
  shipped: { label: 'Shipped', className: 'bg-primary/15 text-primary border-primary/30' },
  delivered: { label: 'Delivered', className: 'bg-success/15 text-success border-success/30' },
  cancelled: { label: 'Cancelled', className: 'bg-destructive/15 text-destructive border-destructive/30' },
  returned: { label: 'Returned', className: 'bg-muted text-muted-foreground border-muted-foreground/30' },
  placed: { label: 'Placed', className: 'bg-info/15 text-info border-info/30' },
};

export const StatusBadge = ({ status }: { status: OrderStatus | string }) => {
  const normalizedStatus = (status || 'pending').toLowerCase();
  
  const config = statusConfig[normalizedStatus as OrderStatus] || { 
    label: normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1), 
    className: 'bg-muted text-muted-foreground border-muted-foreground/30' 
  };

  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border', config.className)}>
      {config.label}
    </span>
  );
};
