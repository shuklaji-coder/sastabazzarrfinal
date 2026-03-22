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

        {/* Premium Category Section */}
        <section className="container mx-auto px-4 py-16 -mt-16 relative z-40">
          <div className="flex flex-col space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-2">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-2 text-primary font-bold tracking-wider uppercase text-sm"
                >
                  <Sparkles className="w-4 h-4" /> Discover More
                </motion.div>
                <h2 className="font-display text-3xl md:text-4xl font-black text-foreground tracking-tight">
                  Shop by <span className="text-primary italic">Category</span>
                </h2>
              </div>
              <Button variant="ghost" asChild className="group text-muted-foreground hover:text-primary w-fit">
                <Link to="/products" className="flex items-center gap-1 font-semibold">
                  View All Collections <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              {categories.slice(0, 6).map((cat, i) => (
                <motion.div
                  key={cat.id || i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <Link
                    to={`/products?category=${cat.name.toLowerCase()}`}
                    className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-muted shadow-lg hover:shadow-2xl transition-all duration-500"
                  >
                    {/* Background Image with Parallax-like effect */}
                    <motion.img
                      src={cat.image}
                      alt={cat.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Dynamic Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Content Component */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                      <div className="space-y-3 transform group-hover:-translate-y-2 transition-transform duration-500">
                        {/* Icon Badge */}
                        <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl shadow-inner group-hover:rotate-12 transition-transform">
                          {cat.icon}
                        </div>

                        <div className="space-y-1">
                          <h3 className="text-xl font-bold text-white tracking-tight">{cat.name}</h3>
                          <p className="text-sm text-white/70 font-medium">
                            {cat.productCount}+ Products
                          </p>
                        </div>

                        {/* CTA button hidden by default */}
                        <div className="h-0 overflow-hidden group-hover:h-8 transition-all duration-500">
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-primary-foreground bg-primary px-3 py-1 rounded-full">
                            Explore <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Glassmorphism Shine Effect on Hover */}
                    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 -rotate-45 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ✨ Premium Promo Banners Section */}
        <section className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 text-primary font-bold tracking-wider uppercase text-sm"
            >
              <Sparkles className="w-4 h-4" /> Exclusive Deals
            </motion.div>
          </div>

          {/* Top Row — 2 Large Banners */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {[
              {
                img: "https://images.unsplash.com/photo-1739132268693-8ba353f0959c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzB8fHNwb3J0JTIwc2hvZXN8ZW58MHx8MHx8fDA%3D",
                title: "Sports Shoes",
                subtitle: "Premium Comfort & Style",
                badge: "MIN. 40% OFF",

                gradient: "from-emerald-900/90 via-emerald-800/60 to-transparent",
                link: "/products?category=shoes"
              },
              {
                img: "data:image/jpeg;base64,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",
                title: "Smart Watches",
                subtitle: "Latest Tech Collection",
                badge: "NEW ARRIVALS",

                gradient: "from-slate-900/90 via-slate-800/60 to-transparent",
                link: "/products?category=watches",
                alignRight: true
              }
            ].map((promo, i) => (
              <motion.div
                key={promo.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
              >
                <Link
                  to={promo.link}
                  className="relative block rounded-2xl overflow-hidden h-56 md:h-72 group cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-500"
                >
                  {/* Background Image */}
                  <img
                    src={promo.img}
                    alt={promo.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${promo.gradient}`} />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500" />

                  {/* Shine Effect on Hover */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </div>

                  {/* Discount Badge */}
                  <div className={`absolute top-4 ${promo.alignRight ? 'right-4' : 'left-4'}`}>
                    <motion.span
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: 'spring', delay: 0.4 + i * 0.15 }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-500/90 backdrop-blur-sm text-white text-xs font-bold shadow-lg"
                    >
                      🔥 {promo.badge}
                    </motion.span>
                  </div>

                  {/* Content */}
                  <div className={`absolute inset-0 p-6 md:p-8 flex flex-col justify-end ${promo.alignRight ? 'items-end text-right' : 'items-start'}`}>
                    <div className="space-y-2 transform group-hover:-translate-y-2 transition-transform duration-500">
                      <span className="text-4xl drop-shadow-lg">{promo.icon}</span>
                      <h3 className="text-white text-2xl md:text-3xl font-black tracking-tight drop-shadow-lg">{promo.title}</h3>
                      <p className="text-white/80 text-sm md:text-base font-medium">{promo.subtitle}</p>

                      {/* CTA Button */}
                      <div className="pt-2">
                        <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-sm font-semibold group-hover:bg-white/25 group-hover:border-white/40 transition-all duration-300 shadow-lg">
                          Shop Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Bottom Row — 3 Smaller Banners */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
                title: "Premium Gadgets",
                subtitle: "Up to 50% Off",
                icon: "🎧",
                gradient: "from-purple-900/90 to-purple-900/20",
                link: "/products?category=electronics"
              },
              {
                img: "https://images.unsplash.com/photo-1558171813-01ed3d751c18?q=80&w=800&auto=format&fit=crop",
                title: "Fashion Store",
                subtitle: "Trending Styles",
                icon: "👗",
                gradient: "from-pink-900/90 to-pink-900/20",
                link: "/products?category=fashion"
              },
              {
                img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop",
                title: "Bags & Accessories",
                subtitle: "Flat 30% Off",
                icon: "🎒",
                gradient: "from-amber-900/90 to-amber-900/20",
                link: "/products?category=bags"
              }
            ].map((promo, i) => (
              <motion.div
                key={promo.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link
                  to={promo.link}
                  className="relative block rounded-2xl overflow-hidden h-44 md:h-52 group cursor-pointer shadow-md hover:shadow-xl transition-all duration-500"
                >
                  <img
                    src={promo.img}
                    alt={promo.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${promo.gradient}`} />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-colors duration-500" />

                  {/* Shine */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </div>

                  <div className="absolute inset-0 p-5 flex flex-col justify-end">
                    <div className="transform group-hover:-translate-y-1 transition-transform duration-500">
                      <span className="text-3xl mb-1 block drop-shadow-lg">{promo.icon}</span>
                      <h3 className="text-white text-lg md:text-xl font-bold tracking-tight">{promo.title}</h3>
                      <p className="text-white/70 text-xs md:text-sm font-medium mb-2">{promo.subtitle}</p>
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white/90 group-hover:text-white transition-colors">
                        Explore <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
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
