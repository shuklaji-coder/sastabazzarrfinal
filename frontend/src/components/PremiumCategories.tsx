import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { categories } from '@/data/mockData';
import { Button } from '@/components/ui/button';

export const PremiumCategories = () => {
  return (
    <section className="container mx-auto px-4 py-24 -mt-20 relative z-40">
      <div className="flex flex-col space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-widest"
            >
              <Sparkles className="w-3.5 h-3.5" /> Curated Collections
            </motion.div>
            <h2 className="font-display text-4xl md:text-5xl font-black text-foreground tracking-tight">
              Shop by <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary bg-300% animate-gradient italic">Category</span>
            </h2>
          </div>
          <Button variant="ghost" asChild className="group text-muted-foreground hover:text-primary w-fit px-6 h-12 rounded-full border border-transparent hover:border-primary/10 transition-all">
            <Link to="/products" className="flex items-center gap-2 font-bold tracking-tight">
              View All Collections <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        {/* Mobile: Horizontal Scroll | Desktop: Grid */}
        <div className="flex overflow-x-auto pb-8 md:pb-0 md:grid md:grid-cols-3 xl:grid-cols-6 gap-5 md:gap-6 hide-scrollbar snap-x">
          {categories.slice(0, 6).map((cat, i) => (
            <motion.div
              key={cat.id || i}
              className="min-w-[260px] w-[260px] md:min-w-0 md:w-full snap-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link
                to={`/products?category=${cat.name.toLowerCase()}`}
                className="group block relative w-full aspect-[4/5] md:aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-[#0A0A0A] shadow-xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-500 border border-white/5"
              >
                {/* Premium Image */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
                
                {/* Deep Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                
                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    
                    {/* Floating Icon */}
                    <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl shadow-lg mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                      {cat.icon}
                    </div>
                    
                    <h3 className="text-3xl font-black text-white leading-tight mb-2 drop-shadow-md">{cat.name}</h3>
                    
                    <p className="text-xs text-cyan-400 font-bold uppercase tracking-widest flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Explore {cat.productCount}+ <ArrowRight className="w-3 h-3" />
                    </p>

                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
