import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CartItem, Product } from '@/data/types';
import { cartService } from '@/services/cartService';
import { useAuth } from './AuthContext';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { isAuthenticated } = useAuth();

  // Helper to sync with localStorage
  const syncStorage = useCallback((newItems: CartItem[]) => {
    localStorage.setItem('cart_items', JSON.stringify(newItems));
    const count = newItems.reduce((sum, i) => sum + (i.quantity || 0), 0);
    localStorage.setItem('cart_count', count.toString());
    
    // Dispatch event for navbar
    window.dispatchEvent(new Event('storage'));
  }, []);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const cartData = await cartService.getUserCart();
      console.log("Cart data received:", cartData);
      console.log("Cart data type:", typeof cartData);
      console.log("Cart data.cartItems:", cartData?.cartItems);
      console.log("Cart data.cartItems type:", typeof cartData?.cartItems);
      console.log("Is cartItems array?", Array.isArray(cartData?.cartItems));
      
      // Handle different response formats
      let cartItems = [];
      if (cartData && cartData.cartItems) {
        cartItems = cartData.cartItems;
      } else if (cartData && Array.isArray(cartData)) {
        cartItems = cartData;
      }
      
      // Apply bargained deals from localStorage
      const existingDealsStr = localStorage.getItem('sastaa_bazaar_bargain_deals');
      if (existingDealsStr) {
        try {
          const deals = JSON.parse(existingDealsStr);
          console.log("Current persistent deals map:", deals);
          
          cartItems = cartItems.map((item: any) => {
            if (!item.product || !item.product.id) return item;
            
            const productIdStr = String(item.product.id);
            const dealPrice = deals[productIdStr];
            
            if (dealPrice) {
              console.log(`Bingo! Applying deal price ${dealPrice} to product id ${productIdStr} (name: ${item.product.name})`);
              return {
                ...item,
                product: {
                  ...item.product,
                  sellingPrice: dealPrice,
                  discountedPrice: dealPrice,
                  price: dealPrice,
                  isBargained: true
                }
              };
            }
            return item;
          });
        } catch (e) {
          console.error("Error parsing bargain deals from storage", e);
        }
      }

      setItems(cartItems);
      console.log("Cart items successfully set and overridden:", cartItems);
    } catch (err: any) {
      console.error("Failed to fetch cart", err);
      // Handle specific error cases
      if (err?.response?.status === 500) {
        console.warn("Server error - cart temporarily unavailable");
      } else if (err?.response?.status === 401 || err?.response?.status === 403) {
        console.warn("Authentication error - please login again");
      } else {
        console.warn("Cart fetch failed:", err?.message || "Unknown error");
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      const stored = localStorage.getItem('cart_items');
      if (stored) {
        try {
          let parsedItems = JSON.parse(stored);
          
          // Apply bargained deals to local guest cart too
          const existingDealsStr = localStorage.getItem('sastaa_bazaar_bargain_deals');
          if (existingDealsStr) {
            try {
              const deals = JSON.parse(existingDealsStr);
              parsedItems = parsedItems.map((item: any) => {
                if (!item.product || !item.product.id) return item;
                const dealPrice = deals[String(item.product.id)];
                if (dealPrice) {
                  return {
                    ...item,
                    product: {
                      ...item.product,
                      sellingPrice: dealPrice,
                      discountedPrice: dealPrice,
                      price: dealPrice,
                      isBargained: true
                    }
                  };
                }
                return item;
              });
            } catch (e) {
              console.error("Error parsing deals in guest check", e);
            }
          }
          
          setItems(parsedItems);
        } catch (e) {
          setItems([]);
        }
      }
    }
  }, [isAuthenticated, fetchCart]);

  const addItem = useCallback(async (product: Product, quantity: number = 1) => {
    if (isAuthenticated) {
      try {
        const productId = typeof product.id === 'string' ? parseInt(product.id) : product.id as number;
        await cartService.addItemToCart(productId, "L", quantity);
        await fetchCart();
      } catch (err: any) {
        console.error("Add to cart failed", err);
      }
    } else {
      setItems(prev => {
        const existingIndex = prev.findIndex(i => String(i.product.id) === String(product.id));
        let newItems;
        if (existingIndex > -1) {
          newItems = [...prev];
          newItems[existingIndex] = { ...newItems[existingIndex], quantity: newItems[existingIndex].quantity + quantity };
        } else {
          newItems = [...prev, { id: product.id.toString(), product, quantity }];
        }
        syncStorage(newItems);
        return newItems;
      });
    }
  }, [isAuthenticated, fetchCart, syncStorage]);

  const removeItem = useCallback(async (productId: string) => {
    if (isAuthenticated) {
      try {
        const itemToRemove = items.find(i => String(i.product.id) === String(productId));
        if (itemToRemove && itemToRemove.id) {
          await cartService.deleteCartItem(itemToRemove.id as number);
          await fetchCart();
        }
      } catch (err) {
        console.error("Remove from cart failed", err);
      }
    } else {
      setItems(prev => {
        const next = prev.filter(i => String(i.product.id) !== String(productId));
        syncStorage(next);
        return next;
      });
    }
  }, [isAuthenticated, items, fetchCart, syncStorage]);

  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    if (isAuthenticated) {
      try {
        const itemToUpdate = items.find(i => String(i.product.id) === String(productId));
        if (itemToUpdate && itemToUpdate.id) {
          await cartService.updateCartItem(itemToUpdate.id as number, { ...itemToUpdate, quantity });
          await fetchCart();
        }
      } catch (err) {
        console.error("Update quantity failed", err);
      }
    } else {
      setItems(prev => {
        const next = prev.map(i => String(i.product.id) === String(productId) ? { ...i, quantity } : i);
        syncStorage(next);
        return next;
      });
    }
  }, [isAuthenticated, items, fetchCart, removeItem, syncStorage]);

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem('cart_items');
    localStorage.removeItem('cart_count');
    console.log("CartContext: Cart cleared (internal + storage)");
  }, []);

  const total = items.reduce((sum, i) => sum + (i.product.sellingPrice || i.product.price || i.product.discountedPrice || 0) * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + (i.quantity || 0), 0);
  
  console.log("Cart items:", items);
  console.log("Item count:", itemCount);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
