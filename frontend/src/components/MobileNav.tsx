import { Link, useLocation } from 'react-router-dom';
import { Home, Search, ShoppingCart, User, Heart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useEffect, useState } from 'react';

export const MobileNav = () => {
  const location = useLocation();
  const { itemCount } = useCart();

  const isActive = (path: string) => location.pathname === path;

  // Hide on certain paths
  const hidePaths = ['/login', '/signup', '/admin', '/seller'];
  const shouldHide = hidePaths.some(path => location.pathname.startsWith(path));

  if (shouldHide) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pointer-events-none">
      <div className="glass shadow-premium rounded-2xl flex items-center justify-around p-2 pointer-events-auto max-w-sm mx-auto">
        <Link 
          to="/" 
          className={`flex flex-col items-center p-2 rounded-xl transition-all ${isActive('/') ? 'text-primary bg-primary/5' : 'text-muted-foreground'}`}
        >
          <Home className={`w-6 h-6 ${isActive('/') ? 'fill-primary/20' : ''}`} />
          <span className="text-[10px] font-bold mt-1">Home</span>
        </Link>
        
        <Link 
          to="/products" 
          className={`flex flex-col items-center p-2 rounded-xl transition-all ${isActive('/products') ? 'text-primary bg-primary/5' : 'text-muted-foreground'}`}
        >
          <Search className="w-6 h-6" />
          <span className="text-[10px] font-bold mt-1">Search</span>
        </Link>

        <Link 
          to="/cart" 
          className={`flex flex-col items-center p-2 rounded-xl transition-all relative ${isActive('/cart') ? 'text-primary bg-primary/5' : 'text-muted-foreground'}`}
        >
          <div className="relative">
            <ShoppingCart className={`w-6 h-6 ${isActive('/cart') ? 'fill-primary/20' : ''}`} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-secondary text-secondary-foreground text-[9px] font-black flex items-center justify-center border-2 border-white">
                {itemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold mt-1">Cart</span>
        </Link>

        <Link 
          to="/orders" 
          className={`flex flex-col items-center p-2 rounded-xl transition-all ${isActive('/orders') ? 'text-primary bg-primary/5' : 'text-muted-foreground'}`}
        >
          <Heart className={`w-6 h-6 ${isActive('/orders') ? 'fill-primary/20' : ''}`} />
          <span className="text-[10px] font-bold mt-1">Wishlist</span>
        </Link>

        <Link 
          to="/login" 
          className={`flex flex-col items-center p-2 rounded-xl transition-all ${isActive('/login') ? 'text-primary bg-primary/5' : 'text-muted-foreground'}`}
        >
          <User className="w-6 h-6" />
          <span className="text-[10px] font-bold mt-1">Account</span>
        </Link>
      </div>
    </div>
  );
};
