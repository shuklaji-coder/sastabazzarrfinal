import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WishlistItem {
  id: number | string;
  title?: string;
  name?: string;
  images?: string[];
  sellingPrice?: number;
  mrpPrice?: number;
  brand?: string;
  [key: string]: any;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (product: WishlistItem) => void;
  removeFromWishlist: (id: number | string) => void;
  isInWishlist: (id: number | string) => boolean;
  toggleWishlist: (product: WishlistItem) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_KEY = 'sastaabazaar_wishlist';

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  const isInWishlist = (id: number | string) =>
    wishlist.some(item => String(item.id) === String(id));

  const addToWishlist = (product: WishlistItem) => {
    if (!isInWishlist(product.id)) {
      setWishlist(prev => [...prev, product]);
    }
  };

  const removeFromWishlist = (id: number | string) => {
    setWishlist(prev => prev.filter(item => String(item.id) !== String(id)));
  };

  const toggleWishlist = (product: WishlistItem) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used inside WishlistProvider');
  return ctx;
};
