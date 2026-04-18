import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { useWishlist } from '@/contexts/WishlistContext';
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Wishlist = () => {
  const { wishlist } = useWishlist();

  return (
    <div className="min-h-screen bg-secondary/10 flex flex-col pt-16 md:pt-20">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/products" className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-secondary transition-colors group">
            <ArrowLeft className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </Link>
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground tracking-tight">Mera <span className="text-primary italic">Wishlist</span></h1>
            <p className="text-muted-foreground mt-1">SastaaBazaar favorites saved for later.</p>
          </div>
        </div>

        {wishlist.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl border border-dashed border-border p-12 text-center max-w-2xl mx-auto my-12"
          >
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-primary opacity-50" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">Wishlist Khali Hai!</h2>
            <p className="text-muted-foreground mb-8 text-lg">Aapne abhi tak koi products save nahi kiye. Kuch behtareen deals explore karein!</p>
            <Button asChild size="lg" className="rounded-full px-8">
              <Link to="/products">Explore Products</Link>
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            <AnimatePresence>
              {wishlist.map((product, i) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard product={product as any} index={i} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Suggested Section if Wishlist is Short */}
        {wishlist.length > 0 && wishlist.length < 4 && (
          <div className="mt-20 border-t border-border pt-12">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-primary" /> Aur bhi dekhein
              </h2>
              <Link to="/products" className="text-primary font-semibold hover:underline">View All &rarr;</Link>
            </div>
            {/* Simple placeholder for related items in real implementation */}
            <p className="text-muted-foreground italic">Trending items will appear here based on your interests.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Wishlist;
