import { Navbar } from '@/components/Navbar';
import { StatusBadge } from '@/components/StatusBadge';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { orderService } from '@/services/orderService';
import { Loader2 } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const data = await orderService.getUserOrderHistory();
        // Assume Spring returns array of Orders
        setOrders(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message || "Failed to load order history.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-bold text-foreground mb-8">My Orders</h1>
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-destructive text-lg">{error}</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          <p className="text-muted-foreground text-lg">You have no orders yet.</p>
          <Link to="/products" className="text-primary hover:underline inline-block">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Link to={`/orders/${order.id}`} className="block bg-card rounded-lg border border-border p-4 md:p-6 hover:border-primary/30 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-display font-semibold text-foreground">Order #{order.id}</h3>
                      <StatusBadge status={order.orderStatus || 'PENDING'} />
                    </div>
                    <p className="text-sm text-muted-foreground">Placed on {new Date(order.orderDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      {order.orderItems?.slice(0, 3).map((item: any) => (
                        <img key={item.id} src={item.product?.images?.[0] || 'https://via.placeholder.com/150'} alt="" className="w-10 h-10 rounded-lg border-2 border-card object-cover" />
                      ))}
                      {order.orderItems?.length > 3 && (
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground border-2 border-card">
                          +{order.orderItems.length - 3}
                        </div>
                      )}
                    </div>
                    <span className="font-display font-bold text-foreground">₹{order.totalSellingPrice?.toLocaleString('en-IN') || '0.00'}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  </div>
  );
};

export default Orders;
