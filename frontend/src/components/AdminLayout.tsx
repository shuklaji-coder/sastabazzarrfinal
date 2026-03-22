import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Store, Package, ShoppingCart, 
  Settings, ArrowLeft, Bell, Search, Menu, LogOut, Hexagon
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/sellers', icon: Store, label: 'Sellers' },
  { to: '/admin/products', icon: Package, label: 'Products' },
  { to: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-secondary/20 flex font-body text-foreground">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border 
        transform transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Header */}
        <div className="h-16 flex items-center px-6 border-b border-border bg-card">
          <Link to="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Hexagon className="w-5 h-5 text-primary fill-primary/20" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-foreground">Admin<span className="text-primary">Panel</span></span>
          </Link>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <div className="mb-4 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Menu
          </div>
          {navItems.map(item => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  active 
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' 
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <item.icon className={`w-5 h-5 ${active ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'} transition-colors`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border bg-card">
           <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-200 group">
             <ArrowLeft className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
             Back to Store
           </Link>
           <button className="w-full mt-1 flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive/80 hover:bg-destructive/10 hover:text-destructive transition-all duration-200 group">
             <LogOut className="w-5 h-5" />
             Sign Out
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-8 z-30 shrink-0 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 rounded-md lg:hidden text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="hidden md:flex items-center relative">
              <Search className="w-4 h-4 absolute left-3 text-muted-foreground pointer-events-none" />
              <input 
                type="text" 
                placeholder="Search everywhere..." 
                className="pl-9 pr-4 py-2 w-64 bg-secondary/50 border border-transparent focus:border-border rounded-lg text-sm outline-none transition-all placeholder:text-muted-foreground focus:bg-background"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <button className="relative p-2 text-muted-foreground hover:bg-secondary hover:text-foreground rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive border-2 border-card"></span>
            </button>
            <div className="w-px h-6 bg-border hidden sm:block"></div>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Admin User</p>
                <p className="text-xs text-muted-foreground leading-none">Superadmin</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden">
                <img src="https://i.pravatar.cc/150?u=admin" alt="Admin" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
        
      </div>
    </div>
  );
};
