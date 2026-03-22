import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';

interface CartItem {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
    sellingPrice?: number;
    discountedPrice?: number;
    originalPrice?: number;
    mrpPrice?: number;
    images?: string[];
    seller?: {
      name: string;
    };
  };
  quantity: number;
}

const Cart = () => {
  const { items, removeItem, updateQuantity, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-secondary/10 flex flex-col">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-20 flex flex-col justify-center items-center text-center space-y-6">
          <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center shadow-sm border border-border">
            <ShoppingBag className="w-20 h-20 text-muted-foreground opacity-50" />
          </div>
          <div>
            <h2 className="font-display text-3xl font-bold text-foreground mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground text-lg mb-8">Looks like you haven't added anything to your cart yet.</p>
            <Link to="/products" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-secondary text-secondary-foreground font-bold text-lg hover:bg-secondary/90 transition-colors shadow-sm">
              Start Shopping
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-16 md:pt-20">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">Shopping Cart</h1>
          <p className="text-muted-foreground mt-1">You have {items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Column: Cart Items */}
          <div className="w-full lg:w-2/3 space-y-4">
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="p-4 md:p-6 border-b border-border bg-muted/20 hidden md:grid grid-cols-12 gap-4 text-sm font-semibold text-muted-foreground tracking-wider uppercase">
                <div className="col-span-6">Product</div>
                <div className="col-span-3 text-center">Quantity</div>
                <div className="col-span-3 text-right">Price</div>
              </div>
              
              <div className="divide-y divide-border">
                {items.map((item, i) => {
                  const finalPrice = item.product?.sellingPrice || item.product?.discountedPrice || item.product?.price || 0;
                  const originalPrice = item.product?.originalPrice || item.product?.mrpPrice || 0;
                  const discount = originalPrice > finalPrice ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100) : 0;
                  
                  return (
                    <motion.div
                      key={item.id || `cart-${item.product?.id || i}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="p-4 md:p-6 flex flex-col md:grid md:grid-cols-12 gap-6 items-center hover:bg-muted/5 transition-colors"
                    >
                      {/* Product Info */}
                      <div className="col-span-6 flex gap-4 w-full">
                        <Link to={`/product/${item.product?.id}`} className="shrink-0 bg-white border border-border rounded-lg p-2 h-24 w-24 flex items-center justify-center">
                          <img 
                            src={item.product?.images?.[0] || 'https://via.placeholder.com/150'} 
                            alt={item.product?.name || 'Product'} 
                            className="max-h-full max-w-full object-contain" 
                          />
                        </Link>
                        <div className="flex flex-col justify-center min-w-0 flex-1">
                          <Link to={`/product/${item.product?.id}`} className="font-body font-semibold text-foreground hover:text-primary transition-colors line-clamp-2 text-sm leading-snug">
                            {item.product?.name}
                          </Link>
                          <p className="text-xs text-muted-foreground mt-1 mb-2">Sold by: {item.product?.seller?.name || 'SastaBazaar'}</p>
                          
                          <div className="flex items-center gap-2 md:hidden">
                            <span className="font-bold text-foreground">₹{finalPrice.toLocaleString('en-IN')}</span>
                            {discount > 0 && <span className="text-xs text-muted-foreground line-through">₹{originalPrice.toLocaleString('en-IN')}</span>}
                          </div>
                            
                          <button 
                            onClick={() => removeItem(String(item.product?.id))} 
                            className="text-xs text-destructive hover:underline self-start flex items-center gap-1 mt-auto"
                          >
                            <Trash2 className="w-3 h-3" /> Remove
                          </button>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="col-span-3 flex justify-center w-full md:w-auto">
                        <div className="flex items-center border border-border rounded-md bg-background shadow-sm h-10">
                          <button 
                            onClick={() => updateQuantity(String(item.product?.id), item.quantity - 1)} 
                            className="w-10 h-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors rounded-l-md"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(String(item.product?.id), item.quantity + 1)} 
                            className="w-10 h-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors rounded-r-md"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Price/Subtotal */}
                      <div className="col-span-3 text-right hidden md:block w-full">
                        <div className="flex flex-col items-end">
                          <span className="font-display font-bold text-lg text-foreground">
                            ₹{(finalPrice * item.quantity).toLocaleString('en-IN')}
                          </span>
                          {item.quantity > 1 && (
                            <span className="text-xs text-muted-foreground">
                              ₹{finalPrice.toLocaleString('en-IN')} each
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Mobile Total */}
                      <div className="md:hidden w-full flex justify-between items-center border-t border-border pt-4 mt-2">
                         <span className="text-sm font-medium">Subtotal</span>
                         <span className="font-display font-bold text-lg text-foreground">
                            ₹{(finalPrice * item.quantity).toLocaleString('en-IN')}
                          </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground text-center">
              The price and availability of items at SastaaBazaar are subject to change. The Cart is a temporary place to store a list of your items and reflects each item's most recent price.
            </p>
          </div>

          {/* Right Column: Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-card rounded-2xl border border-border shadow-sm p-6 sticky top-24">
              <h3 className="font-display font-bold text-xl text-foreground border-b border-border pb-4 mb-4">
                Order Summary
              </h3>
              
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>Items ({items.length}):</span>
                  <span className="text-foreground font-medium">₹{total.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery:</span>
                  <span className="text-success font-medium flex items-center gap-1">
                    Free
                  </span>
                </div>
              </div>
              
              <div className="border-t border-border pt-4 mb-6">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-lg">Order Total:</span>
                  <span className="font-display font-bold text-3xl text-foreground text-right leading-none">
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 text-right border-b border-border pb-4">Inclusive of all taxes</p>
              </div>

              <Link
                to="/checkout"
                className="w-full h-12 flex flex-col items-center justify-center rounded-xl bg-secondary text-secondary-foreground font-bold hover:bg-secondary/90 transition-all shadow-[0_4px_14px_0_rgba(245,158,11,0.39)] hover:shadow-[0_6px_20px_rgba(245,158,11,0.23)] hover:-translate-y-[1px] active:translate-y-0"
              >
                Proceed to Buy
              </Link>

              <div className="mt-6 flex items-start gap-3 bg-success/5 p-3 rounded-lg border border-success/20">
                <ShieldCheck className="w-5 h-5 text-success shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <span className="font-semibold text-foreground">Safe and Secure Payments.</span> Easy returns. 100% Authentic products.
                </p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
