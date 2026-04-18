import { AdminLayout } from '@/components/AdminLayout';
import { adminUsers, salesData, revenueData, orders } from '@/data/mockData';
import { Users, Store, Package, ShoppingCart, DollarSign, ArrowUpRight, ArrowDownRight, MoreHorizontal } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';
import { motion } from 'framer-motion';
import { StatusBadge } from '@/components/StatusBadge';

const stats = [
  { label: 'Total Revenue', value: '₹24,84,500', trend: '+12.5%', isPositive: true, icon: DollarSign, color: 'text-primary', bg: 'bg-primary/10' },
  { label: 'Active Orders', value: '3,847', trend: '+8.2%', isPositive: true, icon: ShoppingCart, color: 'text-success', bg: 'bg-success/10' },
  { label: 'Total Users', value: adminUsers.length.toString(), trend: '-2.4%', isPositive: false, icon: Users, color: 'text-warning', bg: 'bg-warning/10' },
  { label: 'Verified Sellers', value: adminUsers.filter(u => u.role === 'seller').length.toString(), trend: '+4.1%', isPositive: true, icon: Store, color: 'text-info', bg: 'bg-info/10' },
];

const AdminDashboard = () => (
  <AdminLayout>
    <div className="space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1 text-sm">Welcome back, Superadmin. Here's what's happening with your store today.</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="bg-card border border-border text-foreground text-sm rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer shadow-sm">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>This Year</option>
          </select>
          <button className="bg-primary text-primary-foreground text-sm font-semibold rounded-lg px-4 py-2 hover:bg-primary/90 transition-colors shadow-sm focus:ring-2 focus:ring-primary/50 outline-none">
            Download Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.1, duration: 0.5 }} 
            className="bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${stat.isPositive ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                {stat.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.trend}
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium mb-1">{stat.label}</p>
              <h3 className="font-display text-3xl font-bold text-foreground tracking-tight">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-7 gap-6">
        
        {/* Revenue Chart (Larger width) */}
        <div className="lg:col-span-4 bg-card rounded-2xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-bold text-lg text-foreground">Revenue Analytics</h3>
              <p className="text-xs text-muted-foreground mt-1">Monthly performance</p>
            </div>
            <button className="p-1.5 text-muted-foreground hover:bg-secondary rounded-md transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip 
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }} 
                  itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="url(#colorRevenue)" strokeWidth={3} activeDot={{ r: 6, strokeWidth: 0, fill: 'hsl(var(--primary))' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Chart (Smaller width) */}
        <div className="lg:col-span-3 bg-card rounded-2xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-bold text-lg text-foreground">Order Volume</h3>
              <p className="text-xs text-muted-foreground mt-1">Weekly orders processed</p>
            </div>
          </div>
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip 
                  cursor={{ fill: 'hsl(var(--secondary))', opacity: 0.5 }}
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }} 
                />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-lg text-foreground">Recent Orders</h3>
            <p className="text-sm text-muted-foreground">Latest 10 transactions</p>
          </div>
          <button className="text-sm font-semibold text-primary hover:underline">View All</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary/50 text-xs uppercase font-semibold text-muted-foreground">
              <tr>
                <th className="py-4 px-6 border-b border-border">Order ID</th>
                <th className="py-4 px-6 border-b border-border">Customer</th>
                <th className="py-4 px-6 border-b border-border">Date</th>
                <th className="py-4 px-6 border-b border-border">Status</th>
                <th className="py-4 px-6 border-b border-border text-right">Amount</th>
                <th className="py-4 px-6 border-b border-border"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.slice(0, 5).map(o => (
                <tr key={o.id} className="hover:bg-muted/5 transition-colors group cursor-pointer">
                  <td className="py-4 px-6 font-medium text-foreground">#{o.id}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                        {o.address.name.charAt(0)}
                      </div>
                      <span className="text-muted-foreground group-hover:text-foreground transition-colors">{o.address.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-muted-foreground">
                    {new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="py-4 px-6">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="py-4 px-6 text-right font-display font-semibold text-foreground">
                    ₹{o.total.toLocaleString('en-IN')}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-secondary transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  </AdminLayout>
);

export default AdminDashboard;
