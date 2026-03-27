"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { BargainingProductCard } from "@/components/bargaining/BargainingProductCard";
import { BargainingChat } from "@/components/bargaining/BargainingChat";
import { HagglingMeter } from "@/components/bargaining/HagglingMeter";
import { initBargainingSession, processUserOffer, BargainingSession } from "@/lib/bargaining-engine";
import { productService } from "@/services/productService";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import confetti from "canvas-confetti";

export default function AiBhaavTaav() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<BargainingSession | null>(null);
  const [isAiTyping, setIsAiTyping] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const fetchedProduct = await productService.getProductById(parseInt(id));
        setProduct(fetchedProduct);
        
        // Initialize AI session
        const mrp = fetchedProduct.sellingPrice || fetchedProduct.price || 1499;
        const maxDiscount = fetchedProduct.maxBargainingDiscount || 10;
        const language = "hindi"; // Default to Hindi, can be made dynamic
        setSession(initBargainingSession(mrp, maxDiscount, language));
      } catch (err: any) {
        toast.error("Failed to load product for bargaining.");
        navigate(-1);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id, navigate]);

  const handleGoToCart = async () => {
    if (!product || !session) {
      navigate('/cart');
      return;
    }
    try {
      // 1. Save deal price to localStorage so CartContext can pick it up across reloads
      const existingDealsStr = localStorage.getItem('sastaa_bazaar_bargain_deals');
      const deals = existingDealsStr ? JSON.parse(existingDealsStr) : {};
      deals[product.id] = session.lastAiOffer;
      localStorage.setItem('sastaa_bazaar_bargain_deals', JSON.stringify(deals));

      // 2. Add product to cart
      const productWithDealPrice = {
        ...product,
        sellingPrice: session.lastAiOffer,
        discountedPrice: session.lastAiOffer,
        price: session.lastAiOffer,
      };
      await addItem(productWithDealPrice, 1);
      toast.success(`🎉 "${product.name}" cart mein add ho gaya at ₹${session.lastAiOffer}!`);
    } catch (err) {
      console.error('Failed to add bargained item to cart:', err);
      toast.error('Cart mein add nahi hua, dobara try karein.');
    }
    navigate('/cart');
  };

  const handleSendOffer = (offer: number) => {
    if (!session) return;
    
    // Optimistic UI updates - mark AI as typing
    setIsAiTyping(true);
    
    // Simulate network delay for AI thinking (1.5s - 2.5s)
    setTimeout(() => {
      const newSession = processUserOffer(session, offer);
      setSession(newSession);
      setIsAiTyping(false);

      if (newSession.dealState === 'deal-success') {
        runConfetti();
      }
    }, 1500 + Math.random() * 1000);
  };

  const runConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  if (isLoading || !session) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col justify-center items-center">
        <Loader2 className="w-12 h-12 animate-spin text-orange-500 mb-4" />
        <p className="text-white/60 font-medium animate-pulse">Loading Bargaining Room...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] relative overflow-hidden font-body text-white selection:bg-orange-500/30">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-600/10 rounded-full blur-[120px] mix-blend-screen opacity-50" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen opacity-50" />
        {/* Subtle noise texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay" />
      </div>

      {/* Header */}
      <header className="relative z-50 px-4 md:px-8 py-4 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-xl">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </div>
          <span className="font-bold text-sm hidden md:block">Back to Store</span>
        </button>
        
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-orange-400 animate-pulse" />
          <h1 className="font-display font-bold text-lg tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-orange-500 uppercase">
            Sastaa Bazaar <span className="text-white/40 font-normal">|</span> AI Bhaav Taav
          </h1>
        </div>
        
        <div className="w-8" /> {/* Spacer */}
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 container mx-auto px-4 py-6 md:py-8 lg:py-12 flex flex-col lg:flex-row gap-6 lg:gap-8 h-[calc(100vh-80px)] max-h-[1000px]">
        
        {/* Left Panel: Product Showcase */}
        <div className="w-full lg:w-1-[10px] xl:w-[45%] flex-none h-[40vh] lg:h-full min-h-[300px]">
          <BargainingProductCard 
            product={product} 
            currentPrice={session.lastAiOffer} 
            dealState={session.dealState} 
          />
        </div>

        {/* Right Panel: Chat & Meter Interface */}
        <div className="flex-1 flex flex-col gap-4 h-[50vh] lg:h-full min-h-[400px]">
          
          <div className="flex-none drop-shadow-xl animate-fade-in relative z-20">
             <HagglingMeter 
               currentRound={session.currentRound}
               maxRounds={session.maxRounds}
               dealState={session.dealState}
             />
          </div>

          <div className="flex-1 min-h-0 relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
             <BargainingChat 
               session={session}
               onSendOffer={handleSendOffer}
               isAiTyping={isAiTyping}
               onGoToCart={handleGoToCart}
             />
          </div>

        </div>

      </main>
    </div>
  );
}
