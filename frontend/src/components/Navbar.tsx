import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, User, Menu, X, ChevronDown, Package, LayoutDashboard, LogOut } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';

export const Navbar = () => {
  const { itemCount } = useCart();
  const { isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const handleSearch = () => {
    const q = searchQuery.trim();
    if (q) {
      navigate(`/products?search=${encodeURIComponent(q)}`);
      setSearchQuery('');
      setMobileOpen(false);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };


  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const categories = [
    { label: "Electronics", href: "/products?category=electronics" },
    { label: "Fashion", href: "/products?category=fashion" },
    { label: "Home & Kitchen", href: "/products?category=home" },
    { label: "Books", href: "/products?category=books" },
    { label: "Beauty", href: "/products?category=beauty" },
    { label: "Add Product", href: "/add-product" }
  ];

  return (
    <header className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${scrolled ? 'glass shadow-md py-1' : 'bg-primary text-primary-foreground py-3'}`}>
      {/* Top Main Bar */}
      <div className="">
        <div className="container mx-auto px-4 flex items-center justify-between gap-4 md:gap-8">
          
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2 hover:opacity-90 transition-opacity">
            <span className="font-display font-bold text-2xl tracking-tight">
              Sasta<span className="text-secondary">Bazaar</span>
            </span>
          </Link>

          {/* Search Bar - Hidden on mobile, large centered on desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl relative">
            <Input 
              type="text" 
              placeholder="Search for products, brands and more..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="w-full bg-background/95 text-foreground rounded-l-md rounded-r-none border-0 focus-visible:ring-2 focus-visible:ring-secondary h-10 px-4"
            />
            <Button onClick={handleSearch} className="rounded-l-none rounded-r-md bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-none h-10 px-6">
              <Search className="w-5 h-5" />
            </Button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 md:gap-6 flex-shrink-0">
            {/* Account Dropdown */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="hidden md:flex items-center gap-2 hover:text-secondary transition-colors text-sm font-medium outline-none">
                    <User className="w-5 h-5" />
                    <div className="flex flex-col items-start leading-none gap-1">
                      <span className="text-[10px] text-primary-foreground/80 font-normal">Hello, User</span>
                      <span className="font-bold flex items-center gap-1">Account & Lists <ChevronDown className="w-3 h-3" /></span>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer flex items-center"><User className="mr-2 h-4 w-4" /> My Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders" className="cursor-pointer flex items-center"><Package className="mr-2 h-4 w-4" /> Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/seller" className="cursor-pointer flex items-center"><User className="mr-2 h-4 w-4" /> Seller Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="cursor-pointer flex items-center"><LayoutDashboard className="mr-2 h-4 w-4" /> Admin Panel</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive focus:bg-destructive/10">
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center gap-4">
                <Link to="/login" className="text-sm font-medium hover:text-secondary transition-colors">Login</Link>
                <Link to="/signup" className="text-sm font-bold bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/90 transition-colors shadow-sm">
                  Sign Up
                </Link>
              </div>
            )}

            <Link to="/cart" className={`flex items-center gap-1 hover:text-secondary transition-colors relative group ${scrolled ? 'text-primary' : 'text-primary-foreground'}`}>
              <div className="relative">
                <ShoppingCart className="w-7 h-7" />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-secondary text-secondary-foreground text-[11px] font-bold flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="hidden md:block font-bold text-sm mt-2">Cart</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button className="md:hidden p-1 text-primary-foreground hover:text-secondary" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden bg-primary px-4 pb-3 border-t border-primary/20">
        <div className="flex w-full">
          <Input 
            type="text" 
            placeholder="Search SastaaBazaar.in" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="w-full bg-background text-foreground rounded-l-md rounded-r-none border-0 h-10 px-3"
          />
          <Button onClick={handleSearch} className="rounded-l-none rounded-r-md bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-none px-4 h-10">
            <Search className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Bottom Category Navigation Bar - Hidden on scroll or simplified */}
      <div className={`hidden md:block bg-sidebar text-sidebar-foreground border-b border-border shadow-sm transition-all duration-300 ${scrolled ? 'h-0 overflow-hidden' : 'h-10'}`}>
        <div className="container mx-auto px-4 flex items-center gap-6 h-full">
          <div className="flex items-center gap-1 font-bold text-sm cursor-pointer hover:text-primary transition-colors">
            <Menu className="w-4 h-4" /> All
          </div>
          {categories.map((cat, idx) => (
            <Link 
              key={idx} 
              to={cat.href}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {cat.label}
            </Link>
          ))}
          <div className="ml-auto text-sm font-semibold text-primary/90 flex animate-pulse-subtle">
            Special Offers! Up to 50% Off
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background text-foreground shadow-xl border-b border-border animate-fade-in divide-y divide-border">
          <div className="p-4 flex flex-col gap-2">
            {!isAuthenticated && (
              <div className="flex gap-2 mb-2">
                 <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center bg-primary text-primary-foreground py-2 rounded-md font-medium text-sm">Login</Link>
                 <Link to="/signup" onClick={() => setMobileOpen(false)} className="flex-1 text-center bg-secondary text-secondary-foreground py-2 rounded-md font-medium text-sm">Sign Up</Link>
              </div>
            )}
            <Link to="/" onClick={() => setMobileOpen(false)} className={`py-2 px-3 rounded-lg text-sm font-medium ${isActive('/') ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}`}>Home</Link>
            <Link to="/products" onClick={() => setMobileOpen(false)} className={`py-2 px-3 rounded-lg text-sm font-medium ${isActive('/products') ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}`}>Products</Link>
            <Link to="/orders" onClick={() => setMobileOpen(false)} className={`py-2 px-3 rounded-lg text-sm font-medium ${isActive('/orders') ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}`}>Orders</Link>
            {isAuthenticated && (
              <>
                <Link to="/seller" onClick={() => setMobileOpen(false)} className={`py-2 px-3 rounded-lg text-sm font-medium ${isActive('/seller') ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}`}>Seller Profile</Link>
                <Link to="/admin" onClick={() => setMobileOpen(false)} className={`py-2 px-3 rounded-lg text-sm font-medium ${isActive('/admin') ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}`}>Admin Panel</Link>
                <button onClick={() => { logout(); setMobileOpen(false); }} className="text-left py-2 px-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10">Logout</button>
              </>
            )}
          </div>
          <div className="p-4 bg-muted/30">
            <h4 className="font-bold text-sm mb-3 text-muted-foreground">Shop by Category</h4>
            <div className="flex flex-col gap-2">
               {categories.map((cat, idx) => (
                <Link 
                  key={idx} 
                  to={cat.href}
                  onClick={() => setMobileOpen(false)}
                  className="py-1 px-3 text-sm text-foreground hover:text-primary transition-colors"
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
