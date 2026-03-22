import { SellerLayout } from '@/components/SellerLayout';
import { orders } from '@/data/mockData';
import { StatusBadge } from '@/components/StatusBadge';

const SellerOrders = () => (
  <SellerLayout>
    <div className="p-6 md:p-8 space-y-6">
      <h1 className="font-display text-2xl font-bold text-foreground">Orders</h1>
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Order ID</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Customer</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Items</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4 font-medium text-foreground">{order.id}</td>
                  <td className="py-3 px-4 text-muted-foreground">{order.address.name}</td>
                  <td className="py-3 px-4 text-muted-foreground">{order.items.length} items</td>
                  <td className="py-3 px-4 text-muted-foreground">{new Date(order.date).toLocaleDateString()}</td>
                  <td className="py-3 px-4"><StatusBadge status={order.status} /></td>
                  <td className="py-3 px-4 text-right font-display font-semibold text-foreground">₹{order.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </SellerLayout>
);

export default SellerOrders;
