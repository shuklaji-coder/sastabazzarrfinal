import { motion, useAnimation } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { categories } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { useRef, useState, useEffect } from 'react';

export const PremiumCategories = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 1.5 : scrollLeft + clientWidth / 1.5;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 20);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 20);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', handleScroll);
      // Initial check
      handleScroll();
      return () => el.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <section className="container mx-auto px-4 py-24 -mt-20 relative z-40 overflow-hidden">
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

        {/* Slider Container */}
        <div className="relative group">
          {/* Navigation Arrows */}
          <div className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-50 transition-all duration-300 ${showLeftArrow ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <Button 
              variant="secondary" 
              size="icon" 
              onClick={() => scroll('left')}
              className="w-12 h-12 rounded-full shadow-2xl bg-white/90 dark:bg-black/90 backdrop-blur-md border border-white/20 hover:scale-110 active:scale-95 transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
          </div>
          
          <div className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-50 transition-all duration-300 ${showRightArrow ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <Button 
              variant="secondary" 
              size="icon" 
              onClick={() => scroll('right')}
              className="w-12 h-12 rounded-full shadow-2xl bg-white/90 dark:bg-black/90 backdrop-blur-md border border-white/20 hover:scale-110 active:scale-95 transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>

          {/* Categories Wrapper */}
          <div 
            ref={scrollRef}
            className="flex overflow-x-auto pb-4 gap-5 md:gap-8 hide-scrollbar snap-x snap-mandatory"
          >
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id || i}
                className="min-w-[280px] w-[280px] md:min-w-[320px] md:w-[320px] snap-center"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                <Link
                  to={`/products?category=${cat.name.toLowerCase()}`}
                  className="group block relative w-full aspect-[4/5] rounded-[3rem] overflow-hidden bg-[#0A0A0A] shadow-2xl hover:shadow-primary/20 transition-all duration-500 border border-white/5"
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  
                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    <div className="transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                      <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-3xl shadow-xl mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                        {cat.icon}
                      </div>
                      <h3 className="text-3xl font-black text-white leading-tight mb-3 drop-shadow-lg">{cat.name}</h3>
                      <p className="text-sm text-primary font-black uppercase tracking-widest flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        Shop Now <ArrowRight className="w-4 h-4" />
                      </p>
                    </div>
                  </div>
                  
                  {/* Subtle Glow Overlay */}
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
