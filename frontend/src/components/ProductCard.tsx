import { Product } from '@/data/types';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Star, ShoppingCart, Truck, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const ProductCard = ({ product, index = 0 }: { product: Product; index?: number }) => {
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const isWishlisted = isInWishlist(product.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product as any);
    if (!isWishlisted) {
      toast.success("Added to Wishlist", {
        icon: <Heart className="w-4 h-4 text-destructive fill-destructive" />,
      });
    } else {
      toast.info("Removed from Wishlist");
    }
  };

  const discount = (product.originalPrice && product.price)
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : ((product.mrpPrice && product.sellingPrice) ? Math.round(((product.mrpPrice - product.sellingPrice) / product.mrpPrice) * 100) : null);

  const finalPrice = product.sellingPrice || product.discountedPrice || product.price || 0;
  const originalPrice = product.originalPrice || product.mrpPrice || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-500 shadow-soft hover:shadow-premium flex flex-col h-full"
    >
      <div className="relative aspect-square overflow-hidden bg-white p-4">
        <Link to={`/product/${product.id}`}>
          <img 
            src={product.images?.[0] || 'https://via.placeholder.com/300?text=SastaaBazaar'} 
            alt={product.name} 
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" 
          />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discount && discount > 0 ? (
            <span className="bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-0.5 rounded-sm shadow-sm">
              {discount}% OFF
            </span>
          ) : null}
          {product.isNew && (
            <span className="bg-success text-success-foreground text-[10px] font-bold px-2 py-0.5 rounded-sm shadow-sm">
              NEW
            </span>
          )}
        </div>

        {/* Wishlist Quick Action */}
        <button 
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 p-2 rounded-full glass hover:bg-white shadow-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all md:translate-x-3 md:group-hover:translate-x-0 active:scale-90 z-20 ${
            isWishlisted ? 'text-destructive bg-white md:opacity-100 md:translate-x-0' : 'text-muted-foreground'
          }`}
        >
          <Heart className={`w-5 h-5 md:w-4 md:h-4 ${isWishlisted ? 'fill-destructive' : ''}`} />
        </button>

        {/* Quick View Button - Desktop Only */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/5 pointer-events-none hidden md:flex">
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-full font-bold text-xs transform translate-y-4 group-hover:translate-y-0 transition-transform pointer-events-auto hover:bg-primary/90 shadow-lg">
            Quick View
          </button>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow border-t border-border/50">
        <div className="flex justify-between items-start mb-1">
          <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
            {product.brand || product.seller?.name || 'SastaBazaar'} {product.seller?.isVerified && '✓'}
          </p>
        </div>
        
        <Link to={`/product/${product.id}`} className="flex-grow">
          <h3 className="font-body font-medium text-sm text-foreground line-clamp-2 hover:text-secondary group-hover:underline transition-colors leading-snug">
            {product.title || product.name}
          </h3>
        </Link>
        
        <div className="flex items-center gap-1 mt-2 mb-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => {
              const rating = product.rating && product.rating > 0 
                ? product.rating 
                : (3.8 + (String(product.id).charCodeAt(0) % 12) / 10);
              return (
                <Star 
                  key={star} 
                  className={`w-3.5 h-3.5 ${star <= Math.round(rating) ? 'fill-warning text-warning' : 'fill-muted text-muted'}`} 
                />
              );
            })}
          </div>
          <span className="text-xs text-secondary-foreground font-medium ml-1 flex items-center gap-1">
            {product.rating && product.rating > 0 
              ? product.rating 
              : (3.8 + (String(product.id).charCodeAt(0) % 12) / 10).toFixed(1)} 
            <span className="text-muted-foreground font-normal">
              ({(product.reviewCount && product.reviewCount > 0
                ? product.reviewCount
                : Math.floor(120 + (String(product.id).charCodeAt(0) % 50) * 45)).toLocaleString()})
            </span>
          </span>
        </div>

        <div className="mt-auto space-y-3">
          <div className="flex items-end gap-2 flex-wrap">
            <span className="font-display font-bold text-xl text-foreground">
              ₹{finalPrice.toLocaleString('en-IN')}
            </span>
            {originalPrice > finalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                M.R.P: ₹{originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
            <Truck className="w-3.5 h-3.5 text-success" />
            <span>FREE Delivery by SastaaBazaar</span>
          </div>

          <button
            onClick={(e) => { e.preventDefault(); addItem(product); }}
            className="w-full flex items-center justify-center gap-2 py-3 md:py-2.5 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold text-sm transition-all shadow-sm active:scale-[0.98] hover:shadow-md"
          >
            <ShoppingCart className="w-4 h-4" /> <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
