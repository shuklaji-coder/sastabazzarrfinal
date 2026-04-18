import { AdminLayout } from '@/components/AdminLayout';
import { orders } from '@/data/mockData';
import { StatusBadge } from '@/components/StatusBadge';
import { Search, Filter, MoreHorizontal, Download, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { orderService } from '@/services/orderService';
import { toast } from 'sonner';

const AdminOrders = () => {
  const [ordersList, setOrdersList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getAllOrders();
        setOrdersList(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error("Failed to fetch admin orders", err);
        toast.error("Failed to load orders");
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground tracking-tight">Order Management</h1>
            <p className="text-muted-foreground mt-1 text-sm">View, track, and manage customer orders.</p>
          </div>
          <button className="inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-5 py-2.5 rounded-xl font-bold hover:bg-secondary/80 transition-all shadow-sm focus:ring-2 focus:ring-primary/50 outline-none">
            <Download className="w-4 h-4" /> Export Orders
          </button>
        </div>

        {/* Data Table Container */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col">
          
          {/* Table Toolbar */}
          <div className="p-4 md:p-6 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center bg-muted/10">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search by order ID or customer name..." 
                className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-border bg-background rounded-lg text-sm font-medium hover:bg-muted text-foreground transition-colors">
                <Filter className="w-4 h-4 text-muted-foreground" />
                Filter by Status
              </button>
              <select className="flex-1 sm:flex-none border border-border bg-background rounded-lg text-sm font-medium px-4 py-2 hover:bg-muted text-foreground transition-colors outline-none cursor-pointer">
                <option>Newest First</option>
                <option>Oldest First</option>
                <option>Amount: High to Low</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto flex-1 relative">
            {isLoading && (
              <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-10">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            )}
            <table className="w-full text-sm text-left">
              <thead className="bg-secondary/40 text-xs uppercase font-semibold text-muted-foreground">
                <tr>
                  <th className="py-4 px-6 border-b border-border w-10">
                    <input type="checkbox" className="rounded border-border text-primary focus:ring-primary/50" />
                  </th>
                  <th className="py-4 px-6 border-b border-border">Order ID</th>
                  <th className="py-4 px-6 border-b border-border">Customer</th>
                  <th className="py-4 px-6 border-b border-border">Items</th>
                  <th className="py-4 px-6 border-b border-border">Date</th>
                  <th className="py-4 px-6 border-b border-border">Status</th>
                  <th className="py-4 px-6 border-b border-border text-right">Total Amount</th>
                  <th className="py-4 px-6 border-b border-border text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {ordersList.length === 0 && !isLoading ? (
                  <tr>
                    <td colSpan={8} className="py-20 text-center">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-6 h-6 text-muted-foreground/50" />
                      </div>
                      <p className="text-foreground font-semibold mb-1">No orders found</p>
                      <p className="text-muted-foreground text-sm">We couldn't find anything matching your search.</p>
                    </td>
                  </tr>
                ) : ordersList.map(o => (
                  <tr key={o.id} className="hover:bg-muted/5 transition-colors group cursor-pointer">
                    <td className="py-4 px-6 w-10">
                      <input type="checkbox" className="rounded border-border text-primary focus:ring-primary/50" />
                    </td>
                    <td className="py-4 px-6 font-semibold text-foreground">#{o.id}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                          {o.user?.firstName?.charAt(0) || o.shippingAddress?.firstName?.charAt(0) || 'U'}
                        </div>
                        <div>
                           <span className="font-medium text-foreground block">{o.user?.firstName} {o.user?.lastName}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-muted-foreground font-medium">
                      {o.orderItems?.length || 0} items
                    </td>
                    <td className="py-4 px-6 text-muted-foreground">
                      {o.orderDate ? new Date(o.orderDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                    </td>
                     <td className="py-4 px-6">
                      <StatusBadge status={o.orderStatus || 'PENDING'} />
                    </td>
                    <td className="py-4 px-6 text-right">
                       <span className="font-display font-bold text-foreground text-[15px]">
                         ₹{o.totalSellingPrice?.toLocaleString('en-IN') || 0}
                       </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors inline-block" title="More Actions">
                         <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Footer */}
          {ordersList.length > 0 && (
            <div className="p-4 border-t border-border bg-card flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
               <div>Showing <span className="font-medium text-foreground">{ordersList.length}</span> orders</div>
               <div className="flex items-center gap-2">
                 <button className="px-3 py-1.5 border border-border rounded-md hover:bg-secondary hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>Previous</button>
                 <button className="px-3 py-1.5 border border-primary bg-primary text-primary-foreground rounded-md transition-colors">1</button>
                 <button className="px-3 py-1.5 border border-border rounded-md hover:bg-secondary hover:text-foreground transition-colors">2</button>
                 <button className="px-3 py-1.5 border border-border rounded-md hover:bg-secondary hover:text-foreground transition-colors">Next</button>
               </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
