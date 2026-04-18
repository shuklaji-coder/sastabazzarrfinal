import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, BarChart3, Boxes, Settings, ArrowLeft } from 'lucide-react';

const navItems = [
  { to: '/seller', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/seller/products', icon: Package, label: 'Products' },
  { to: '/seller/orders', icon: ShoppingCart, label: 'Orders' },
  { to: '/seller/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/seller/inventory', icon: Boxes, label: 'Inventory' },
  { to: '/seller/settings', icon: Settings, label: 'Settings' },
];

export const SellerLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 bg-sidebar border-r border-sidebar-border hidden md:flex flex-col">
        <div className="p-6">
          <Link to="/" className="text-sm text-sidebar-foreground hover:text-sidebar-accent-foreground flex items-center gap-2 mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Store
          </Link>
          <h2 className="font-display font-bold text-lg text-sidebar-primary-foreground">Seller Dashboard</h2>
          <p className="text-xs text-sidebar-foreground mt-1">TechVault Store</p>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map(item => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active ? 'bg-sidebar-accent text-sidebar-primary' : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};
