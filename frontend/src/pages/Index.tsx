import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { categories } from '@/data/mockData';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, TrendingUp, Shield, Truck, ChevronRight, ChevronLeft, Loader2, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { productService } from '@/services/productService';
import { Button } from '@/components/ui/button';
import { FlashSaleTimer } from '@/components/FlashSaleTimer';

const Index = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      video: "https://redtape.com/cdn/shop/videos/c/vp/ed22fca6ba0c4139a5a1a97d946d8ac5/ed22fca6ba0c4139a5a1a97d946d8ac5.HD-1080p-7.2Mbps-64034642.mp4?v=0",
      title: "Welcome to Sastaa Bazaar",
      subtitle: "AI-Powered Shopping with the Best Deals on Fashion, Gadgets & More",
      highlight: "Up to 60% OFF on Trending Products",
      cta: "Start Shopping",
      secondaryCta: "Explore Deals",
      link: "/products"
    },
    {
      image: "https://redtape.com/cdn/shop/files/website_banner_copy_1700x.jpg?v=1764323802",

      subtitle: "Premium footwear for every style and occasion",
      cta: "Shop Now",
      link: "/products?category=fashion"
    },
    {
      image: "https://redtape.com/cdn/shop/files/3_copy_2_a67d3fba-1517-41fd-925e-937252e2f368_1700x.jpg?v=1770960216",

      cta: "Shop RedTape",
      link: "/products?category=fashion"
    },




  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productService.getAllProducts();
        const data = response.content || response;
        if (Array.isArray(data)) {
          setProducts(data);
        }
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();

    // Load recently viewed
    const stored = localStorage.getItem('recently_viewed');
    if (stored) {
      try {
        setRecentlyViewed(JSON.parse(stored));
      } catch (e) {
        console.error("Error parsing recently viewed", e);
      }
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  // Group products for different sections
  const featured = products.filter(p => p.isFeatured || p.rating >= 4.5).slice(0, 4);
  const trending = products.length > 4 ? products.slice(4, 9) : products.slice(0, 4);
  const newArrivals = products.reverse().slice(0, 4);

  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col pt-16 md:pt-20">
      <Navbar />

      <main className="flex-grow">
        {/* Dynamic Hero Carousel */}
        <section className="relative w-full h-[350px] md:h-[500px] lg:h-[600px] overflow-hidden bg-foreground">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
              <div className="absolute inset-0 bg-black/40 z-10" /> {/* Dark Overlay */}
              {slide.video ? (
                <video
                  src={slide.video}
                  autoPlay
                  muted
                  loop={false}
                  playsInline
                  className="w-full h-full object-cover"
                  onEnded={() => {
                    const nextSlide = (currentSlide + 1) % heroSlides.length;
                    setCurrentSlide(nextSlide);
                  }}
                />
              ) : (
                <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
              )}

              <div className="absolute inset-0 z-20 flex items-center justify-start container mx-auto px-6 md:px-12">
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={index === currentSlide ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="max-w-xl text-white space-y-4 md:space-y-6"
                >
                  <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    animate={index === currentSlide ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-4xl md:text-7xl font-display font-black leading-tight drop-shadow-lg"
                  >
                    {slide.title}
                  </motion.h2>
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={index === currentSlide ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-lg md:text-2xl opacity-90 font-medium"
                  >
                    {slide.subtitle}
                  </motion.p>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={index === currentSlide ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <Button asChild size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 text-lg px-8 h-12 md:h-14 rounded-full shadow-lg hover:shadow-xl transition-all">
                      <Link to={slide.link}>{slide.cta} <ArrowRight className="ml-2 w-5 h-5" /></Link>
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          ))}

          {/* Carousel Controls */}
          <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm transition-all">
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
          </button>
          <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm transition-all">
            <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-3 h-3 rounded-full transition-all ${idx === currentSlide ? 'bg-primary w-8' : 'bg-white/50 hover:bg-white/80'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </section>

        {/* ✨ Premium Category Discovery Section */}
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

            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              {categories.slice(0, 6).map((cat, i) => (
                <motion.div
                  key={cat.id || i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <Link
                    to={`/products?category=${cat.name.toLowerCase()}`}
                    className="group relative block aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-muted shadow-xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition-all duration-500"
                  >
                    {/* Background Image with 3D-like hover */}
                    <motion.img
                      src={cat.image}
                      alt={cat.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />

                    {/* Multi-layered Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-70 group-hover:opacity-80 transition-opacity" />
                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Content Component */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                      <div className="space-y-4 transform group-hover:-translate-y-2 transition-transform duration-500">
                        {/* Floating Icon Badge */}
                        <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-3xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] transform group-hover:rotate-[15deg] group-hover:scale-110 transition-all duration-500">
                          {cat.icon}
                        </div>

                        <div className="space-y-1">
                          {/* Dynamic Status Badge (Simulated) */}
                          {i === 0 && (
                            <span className="inline-block px-2 py-0.5 rounded-full bg-red-500 text-[8px] font-black text-white uppercase tracking-tighter mb-1">
                              Trending
                            </span>
                          )}
                          {i === 2 && (
                            <span className="inline-block px-2 py-0.5 rounded-full bg-cyan-500 text-[8px] font-black text-white uppercase tracking-tighter mb-1">
                              New
                            </span>
                          )}
                          <h3 className="text-2xl font-black text-white tracking-tighter leading-none">{cat.name}</h3>
                          <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest group-hover:text-primary transition-colors">
                            {cat.productCount}+ Selected Items
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Advanced Shine Effect */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ✨ Ultra-Premium Exclusive Deals Section */}
        <section className="relative py-24 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30">
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-widest"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Limited Time Offers
                </motion.div>
                <h2 className="font-display text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.1]">
                  Exclusive <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary bg-300% animate-gradient">Deals</span>
                </h2>
                <p className="text-muted-foreground text-lg max-w-xl font-medium">
                  Hand-picked premium selections with unbeatable value. Grab them before they're gone!
                </p>
              </div>

              {/* Countdown for Urgency */}
              <div className="bg-[#0A0A0A] backdrop-blur-2xl border border-red-500/10 p-6 md:p-8 rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] flex flex-col items-center md:items-start gap-4 transform lg:translate-y-4">
                <div className="flex items-center gap-3 text-red-500 font-black text-xs uppercase tracking-[0.2em] drop-shadow-lg">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse border-2 border-red-400/30 shadow-[0_0_10px_rgba(220,38,38,0.5)]" />
                  Flash Sale Ends In
                </div>
                <FlashSaleTimer />
              </div>
            </div>

            {/* Featured Spotlight Deal */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8 mt-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="lg:col-span-8 group relative rounded-[2.5rem] overflow-hidden bg-foreground aspect-[16/9] md:aspect-auto md:h-[500px] shadow-2xl cursor-pointer"
              >
                <img
                  src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop"
                  alt="Spotlight Deal"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                
                {/* Spotlight Content */}
                <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
                  <div className="max-w-md space-y-4 transform group-hover:-translate-y-2 transition-transform duration-500">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-white text-black text-sm font-black uppercase tracking-tighter">
                      Deal of the Day
                    </span>
                    <h3 className="text-white text-4xl md:text-6xl font-black leading-none drop-shadow-2xl">
                      Ultra Boost <span className="text-primary italic">Edition</span>
                    </h3>
                    <p className="text-white/80 text-lg font-medium drop-shadow-md">
                      Experience ultimate comfort with our most exclusive footwear drop of the season.
                    </p>
                    <div className="flex items-center gap-6 pt-4">
                      <Button size="lg" className="rounded-full h-14 px-8 text-lg font-bold bg-white text-black hover:bg-primary hover:text-white transition-all group/btn shadow-xl hover:shadow-primary/20">
                        Claim Offer <ArrowRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                      <div className="flex flex-col">
                        <span className="text-white/50 text-sm line-through font-bold">₹12,999</span>
                        <span className="text-primary text-3xl font-black italic">₹5,499</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interactive Glass Shine */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </motion.div>

              {/* Side Banners */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                {[
                  {
                    title: "Audio Pro Max",
                    discount: "UP TO 45% OFF",
                    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop",
                    color: "from-purple-900/40",
                    link: "/products?category=electronics"
                  },
                  {
                    title: "Urban Style",
                    discount: "FLAT 30% OFF",
                    img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop",
                    color: "from-pink-900/40",
                    link: "/products?category=fashion"
                  }
                ].map((deal, i) => (
                  <motion.div
                    key={deal.title}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                  >
                    <Link
                      to={deal.link}
                      className="group relative flex-1 h-[238px] block rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500"
                    >
                      <img src={deal.img} alt={deal.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className={`absolute inset-0 bg-gradient-to-t ${deal.color} via-transparent to-transparent`} />
                      <div className="absolute inset-0 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="absolute inset-0 p-8 flex flex-col justify-end">
                        <span className="text-primary text-xs font-black tracking-widest mb-1">{deal.discount}</span>
                        <h4 className="text-white text-2xl font-black">{deal.title}</h4>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Bottom Category Grid - Smaller Interactive Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[
                { label: "Watches", tag: "Premium", icon: "⌚", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&fit=crop" },
                { label: "Sneakers", tag: "Trending", icon: "👟", img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=400&fit=crop" },
                { label: "Bags", tag: "Minimal", icon: "🎒", img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=400&fit=crop" },
                { label: "Beauty", tag: "Organic", icon: "✨", img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=400&fit=crop" }
              ].map((cat, i) => (
                <motion.div
                  key={cat.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                >
                  <div className="group relative aspect-square rounded-[2rem] overflow-hidden cursor-pointer bg-muted shadow-lg hover:shadow-2xl transition-all duration-500">
                    <img src={cat.img} alt={cat.label} className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100" />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-primary/20 transition-colors" />
                    
                    <div className="absolute inset-0 p-6 flex flex-col justify-between">
                      <span className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-xl shadow-lg transform group-hover:rotate-12 transition-transform">
                        {cat.icon}
                      </span>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-tighter text-primary">{cat.tag}</span>
                        <h5 className="text-white text-xl font-bold">{cat.label}</h5>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Loading State or Products */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="text-muted-foreground font-medium animate-pulse">Curating the best products for you...</p>
          </div>
        ) : (
          <>
            {/* Recently Viewed Items */}
            {recentlyViewed.length > 0 && (
              <section className="container mx-auto px-4 py-12">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
                    <RotateCcw className="w-6 h-6 text-primary" /> Recently Viewed
                  </h2>
                  <Button variant="ghost" onClick={() => {
                    localStorage.removeItem('recently_viewed');
                    setRecentlyViewed([]);
                  }} className="text-muted-foreground text-xs">Clear All</Button>
                </div>
                <div className="flex overflow-x-auto pb-6 gap-6 hide-scrollbar snap-x">
                  {recentlyViewed.map((product, i) => (
                    <div key={`recent-${product.id}`} className="min-w-[240px] w-[240px] md:min-w-[260px] snap-center">
                      <ProductCard product={product} index={i} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Featured / Trending Horizontal Scroll */}
            {trending.length > 0 && (
              <section className="bg-card w-full py-12 border-y border-border mb-12 shadow-sm">
                <div className="container mx-auto px-4">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
                      <TrendingUp className="w-6 h-6 text-primary" /> Trending Now
                    </h2>
                    <Button variant="outline" asChild>
                      <Link to="/products">See All</Link>
                    </Button>
                  </div>

                  <div className="flex overflow-x-auto pb-6 gap-6 hide-scrollbar snap-x">
                    {trending.map((product, i) => (
                      <div key={product.id || i} className="min-w-[280px] w-[280px] md:min-w-[300px] snap-center">
                        <ProductCard product={product} index={i} />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Standard Products Grid */}
            <section className="container mx-auto px-4 py-8 mb-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-display text-2xl font-bold text-foreground">Recommended for You</h2>
                <Link to="/products" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
                  View full catalog <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
                {(products.length > 0 ? products.slice(0, 10) : Array(10).fill(null)).map((product, i) => (
                  product ? (
                    <ProductCard key={product.id || i} product={product} index={i} />
                  ) : (
                    // Skeleton Loading Cards
                    <div key={`skel-${i}`} className="bg-card rounded-lg overflow-hidden border border-border shadow-sm">
                      <div className="w-full aspect-square animate-shimmer" />
                      <div className="p-4 space-y-3">
                        <div className="h-4 w-2/3 bg-muted rounded animate-shimmer" />
                        <div className="h-4 w-1/2 bg-muted rounded animate-shimmer" />
                        <div className="h-6 w-1/3 bg-muted rounded animate-shimmer mt-4" />
                      </div>
                    </div>
                  )
                ))}
              </div>
            </section>
          </>
        )}

        {/* Global Features / Trust Badges - Bottom */}
        <section className="bg-sidebar border-t border-border py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center shadow-sm">
                  <Truck className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="font-bold text-foreground">Fast & Free Delivery</h3>
                <p className="text-sm text-muted-foreground">Free shipping on all orders over ₹499</p>
              </div>
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center shadow-sm">
                  <Shield className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="font-bold text-foreground">Secure Payments</h3>
                <p className="text-sm text-muted-foreground">100% secure payment gateways</p>
              </div>
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center shadow-sm">
                  <TrendingUp className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="font-bold text-foreground">Best Prices Offers</h3>
                <p className="text-sm text-muted-foreground">Guaranteed lowest prices online</p>
              </div>
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center shadow-sm">
                  <Sparkles className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="font-bold text-foreground">Quality Assured</h3>
                <p className="text-sm text-muted-foreground">Original brands and top quality</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
