import { SellerLayout } from '@/components/SellerLayout';
import { DollarSign, Package, ShoppingCart, TrendingUp, Star, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';
import { StatusBadge } from '@/components/StatusBadge';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { productService } from '@/services/productService';
import { orderService } from '@/services/orderService';
import { userService } from '@/services/userService';
import { salesData, revenueData } from '@/data/mockData';

const SellerDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { label: 'Total Revenue', value: '₹0', change: '0%', icon: DollarSign, color: 'text-success' },
    { label: 'Total Orders', value: '0', change: '0%', icon: ShoppingCart, color: 'text-info' },
    { label: 'Products', value: '0', change: '0%', icon: Package, color: 'text-primary' },
    { label: 'Avg Rating', value: '4.5', change: '0', icon: Star, color: 'text-warning' },
  ]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [sellerName, setSellerName] = useState('Seller');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [ordersRes, productsRes, profileRes] = await Promise.all([
          orderService.getSellerOrders(),
          productService.getAllProducts(), // TODO: Add seller-specific filter API endpoint
          userService.getUserProfile()
        ]);

        const sellerOrders = Array.isArray(ordersRes) ? ordersRes : (ordersRes.content || []);
        const allProducts = Array.isArray(productsRes) ? productsRes : (productsRes.content || []);
        
        // TODO: Filter products by seller ID when backend supports it
        // For now, showing all products (in production, this would be seller-specific)
        const sellerProducts = allProducts;
        
        // Calculate Revenue
        const totalRevenue = sellerOrders.reduce((sum: number, order: any) => sum + (order.total || 0), 0);
        
        // Get product names for display
        const productNames = sellerProducts.slice(0, 5).map(p => p.title || p.name).join(', ');
        
        console.log('Seller Products:', sellerProducts.map(p => ({ id: p.id, name: p.title || p.name, price: p.sellingPrice })));
        
        setStats([
          { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, change: '+12.5%', icon: DollarSign, color: 'text-success' },
          { label: 'Total Orders', value: sellerOrders.length.toLocaleString(), change: '+8.2%', icon: ShoppingCart, color: 'text-info' },
          { label: 'Products', value: sellerProducts.length.toString(), change: '+3', icon: Package, color: 'text-primary' },
          { label: 'Avg Rating', value: '4.8', change: '+0.2', icon: Star, color: 'text-warning' },
        ]);

        setRecentOrders(sellerOrders.slice(0, 5));
        setSellerName(profileRes.firstName || profileRes.username || 'Seller');
        
        // Log product details for debugging
        console.log('=== SELLER DASHBOARD PRODUCT LIST ===');
        sellerProducts.forEach((product, index) => {
          console.log(`${index + 1}. ${product.title || product.name} - ₹${product.sellingPrice || product.price} (ID: ${product.id})`);
        });
        
      } catch (err) {
        console.error("Dashboard data fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <SellerLayout>
        <div className="h-[80vh] flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout>
      <div className="p-6 md:p-8 space-y-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground transition-all">Welcome back, {sellerName}</h1>
          <p className="text-muted-foreground text-sm mt-1">Here's your store overview with real-time data</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-card rounded-lg border border-border p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted-foreground font-medium">{stat.label}</span>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <p className="font-display text-2xl font-bold text-foreground">{stat.value}</p>
              <p className={`text-[10px] font-medium mt-1 ${stat.color}`}>{stat.change} target achievement</p>
            </motion.div>
          ))}
        </div>

        {/* Charts - Keeping mock chart data for visual consistency as backend might not support time-series yet */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-lg border border-border p-6 overflow-hidden">
            <h3 className="font-display font-semibold text-foreground mb-4">Sales Overview</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-card rounded-lg border border-border p-6 overflow-hidden">
            <h3 className="font-display font-semibold text-foreground mb-4">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: 'hsl(var(--primary))', r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-card rounded-lg border border-border p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-foreground">Recent Orders</h3>
            <Link to="/seller/orders" className="text-sm text-primary hover:underline font-medium">View All</Link>
          </div>
          <div className="overflow-x-auto -mx-6 md:mx-0">
            <div className="inline-block min-w-full align-middle px-6 md:px-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground whitespace-nowrap">Order ID</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground whitespace-nowrap">Customer</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground whitespace-nowrap">Status</th>
                    <th className="text-right py-3 px-2 font-medium text-muted-foreground whitespace-nowrap">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-muted-foreground">No orders yet.</td>
                    </tr>
                  ) : (
                    recentOrders.map(order => (
                      <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-2 font-medium text-foreground whitespace-nowrap uppercase text-[10px]">{order.id}</td>
                        <td className="py-3 px-2 text-muted-foreground line-clamp-1">{order.address?.firstName || order.user?.username || 'Customer'}</td>
                        <td className="py-3 px-2"><StatusBadge status={order.orderStatus || order.status} /></td>
                        <td className="py-3 px-2 text-right font-display font-bold text-foreground whitespace-nowrap">₹{(order.total || 0).toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
};

export default SellerDashboard;
