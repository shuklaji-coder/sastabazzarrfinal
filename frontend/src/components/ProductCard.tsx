import { Product } from '@/data/types';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Star, ShoppingCart, Truck, Heart, Zap, ShieldCheck, Eye, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export const ProductCard = ({ product, index = 0 }: { product: Product; index?: number }) => {
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isAdding, setIsAdding] = useState(false);
  
  const isWishlisted = isInWishlist(product.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product as any);
    if (!isWishlisted) {
      toast.success("Added to Wishlist", {
        icon: <Heart className="w-4 h-4 text-destructive fill-destructive" />,
        className: "bg-[#050618] border-red-500/20 text-white"
      });
    } else {
      toast.info("Removed from Wishlist");
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    
    // Premium feedback delay
    setTimeout(() => {
        addItem(product);
        setIsAdding(false);
        toast.success(`Added ${product.title || product.name} to cart!`, {
            icon: <ShoppingCart className="w-4 h-4 text-cyan-400" />,
            className: "bg-[#050618] border-cyan-500/20 text-white"
        });
    }, 600);
  };

  const discount = (product.originalPrice && product.price)
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : ((product.mrpPrice && product.sellingPrice) ? Math.round(((product.mrpPrice - product.sellingPrice) / product.mrpPrice) * 100) : null);

  const finalPrice = product.sellingPrice || product.discountedPrice || product.price || 0;
  const originalPrice = product.originalPrice || product.mrpPrice || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -8, transition: { duration: 0.3, ease: "easeOut" } }}
      className="group relative bg-white dark:bg-[#0A0A0A] rounded-[2rem] overflow-hidden border border-gray-100 dark:border-white/5 hover:border-cyan-500/30 transition-all duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col h-full perspective-1000"
    >
      {/* ─── Image Header ─── */}
      <div className="relative aspect-[1/1] overflow-hidden bg-[#F8F8F8] dark:bg-black/20 group-hover:bg-[#F0F0F0] dark:group-hover:bg-black/40 transition-colors duration-700">
        <Link to={`/product/${product.id}`} className="block w-full h-full p-2 md:p-3">
          <motion.img 
            src={product.images?.[0] || 'https://via.placeholder.com/300?text=SastaaBazaar'} 
            alt={product.name} 
            className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.1)] group-hover:scale-105 transition-transform duration-700 ease-out" 
          />
        </Link>
        
        {/* Floating Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
          <AnimatePresence>
            {discount && discount > 0 && (
              <motion.span 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }}
                className="bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg flex items-center gap-1 uppercase tracking-tighter"
              >
                <Zap className="w-3 h-3 fill-current" /> {discount}% OFF
              </motion.span>
            )}
            {product.isNew && (
              <motion.span 
                 initial={{ scale: 0 }} 
                 animate={{ scale: 1 }}
                 className="bg-cyan-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg flex items-center gap-1 uppercase tracking-tighter"
              >
                NEW ARRIVAL
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Wishlist Button */}
        <button 
          onClick={handleWishlistToggle}
          className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md border border-white/20 shadow-lg z-20 transition-all duration-300 ${
            isWishlisted ? 'bg-red-500 text-white scale-110' : 'bg-white/10 text-white/40 hover:text-red-500 hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Cinematic Underlay Shine */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
      </div>

      {/* ─── Content Area ─── */}
      <div className="p-5 flex flex-col flex-grow relative bg-white dark:bg-transparent">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-white/5 px-2 py-0.5 rounded-full border border-gray-100 dark:border-white/10">
            <span className="text-[9px] text-gray-400 dark:text-white/40 font-black uppercase tracking-[0.1em]">
              {product.brand || product.seller?.name || 'SastaBazaar'}
            </span>
            {product.seller?.isVerified && <ShieldCheck className="w-2.5 h-2.5 text-cyan-500" />}
          </div>
          
          <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
             <Star className="w-3 h-3 text-yellow-500 fill-current" />
             <span className="text-[10px] font-black dark:text-white/60">
                {product.rating || (3.8 + (String(product.id).charCodeAt(0) % 12) / 10).toFixed(1)}
             </span>
          </div>
        </div>
        
        <Link to={`/product/${product.id}`} className="flex-grow group/title">
          <h3 className="font-bold text-[13px] md:text-sm text-gray-800 dark:text-white/90 line-clamp-2 leading-tight group-hover/title:text-cyan-500 transition-colors">
            {product.title || product.name}
          </h3>
        </Link>
        
        {/* Pricing Segment */}
        <div className="mt-4 mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-gray-900 dark:text-white tracking-tighter italic">
              ₹{finalPrice.toLocaleString('en-IN')}
            </span>
            {originalPrice > finalPrice && (
              <span className="text-[11px] text-gray-400 dark:text-white/20 line-through font-bold">
                ₹{originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-[9px] text-green-500 dark:text-green-400 font-black uppercase tracking-widest mt-0.5">
            <Truck className="w-3 h-3" />
            <span>Fast Express Shipping</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-5 gap-2 mt-auto">
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="col-span-4 h-11 flex items-center justify-center gap-2 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-black text-[11px] uppercase tracking-widest transition-all shadow-xl active:scale-[0.95] disabled:opacity-50 group/buy"
          >
            {isAdding ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5 transition-transform group-hover/buy:-translate-y-0.5" /> 
                <span>Add To Cart</span>
              </>
            )}
          </button>
          
          <Link 
            to={`/product/${product.id}`}
            className="col-span-1 h-11 flex items-center justify-center rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-gray-400 dark:text-white/30 hover:bg-cyan-500 hover:text-white hover:border-cyan-500 transition-all active:scale-90"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Edge Accents (Premium Lighting) */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/0 group-hover:via-cyan-500/50 to-transparent transition-all duration-700" />
      <div className="absolute inset-0 border border-white/0 group-hover:border-white/10 pointer-events-none rounded-[2rem] transition-colors" />
    </motion.div>
  );
};

export default ProductCard;
