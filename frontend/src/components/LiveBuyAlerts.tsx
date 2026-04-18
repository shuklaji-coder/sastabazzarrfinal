import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { ShoppingBag, ShoppingCart, Eye, Sparkles } from 'lucide-react';

// Mock Data for the FOMO Engine
const NAMES = ["Rahul", "Priya", "Amit", "Sneha", "Vikram", "Neha", "Rohan", "Anjali", "Karan", "Pooja", "Arjun", "Riya"];
const CITIES = ["Delhi", "Mumbai", "Bangalore", "Pune", "Hyderabad", "Chennai", "Kolkata", "Ahmedabad", "Jaipur", "Indore"];
const PRODUCTS = [
  "Ultra Boost Edition", 
  "Audio Pro Max Headphones", 
  "Smart Watch Series X", 
  "Premium Leather Wallet", 
  "Urban Style Hoodie", 
  "Wireless Earbuds", 
  "Gaming Mechanical Keyboard",
  "Sastaaa Exclusive T-Shirt"
];
const ACTIONS = [
  { type: "bought", text: "just bought", icon: ShoppingBag, color: "text-green-400", bg: "bg-green-500/20", border: "border-green-500/30" },
  { type: "cart", text: "added to cart", icon: ShoppingCart, color: "text-amber-400", bg: "bg-amber-500/20", border: "border-amber-500/30" },
  { type: "viewing", text: "is viewing right now", icon: Eye, color: "text-cyan-400", bg: "bg-cyan-500/20", border: "border-cyan-500/30" }
];

interface AlertData {
  id: number;
  name: string;
  city: string;
  product: string;
  action: typeof ACTIONS[0];
  timeAgo: string;
}

const generateRandomAlert = (): AlertData => {
  const name = NAMES[Math.floor(Math.random() * NAMES.length)];
  const city = CITIES[Math.floor(Math.random() * CITIES.length)];
  const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
  const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
  
  // Random time between 1 and 15 mins ago
  const minutes = Math.floor(Math.random() * 15) + 1;
  const timeAgo = `${minutes} min ago`;

  return {
    id: Date.now(),
    name,
    city,
    product,
    action,
    timeAgo
  };
};

export const LiveBuyAlerts = () => {
  const [currentAlert, setCurrentAlert] = useState<AlertData | null>(null);
  const location = useLocation();

  // Hide on admin, seller, login, and signup routes to keep them distraction-free
  const hiddenRoutes = ['/admin', '/seller', '/login', '/signup'];
  const isHidden = hiddenRoutes.some(route => location.pathname.startsWith(route));

  useEffect(() => {
    if (isHidden) return;

    const triggerNextAlert = () => {
      // 1. Show an alert
      setCurrentAlert(generateRandomAlert());

      // 2. Hide it after 5 seconds
      setTimeout(() => {
        setCurrentAlert(null);
      }, 5000);

      // 3. Schedule next alert after a random delay (between 8 to 25 seconds)
      const nextDelay = Math.floor(Math.random() * 17000) + 8000;
      timerId = setTimeout(triggerNextAlert, nextDelay);
    };

    // Initial delay before first alert (5 seconds)
    let timerId = setTimeout(triggerNextAlert, 5000);

    return () => {
      clearTimeout(timerId);
    };
  }, [isHidden]);

  if (isHidden) return null;

  const Icon = currentAlert?.action.icon;

  return (
    <div className="fixed bottom-20 left-4 sm:bottom-6 sm:left-6 z-50 pointer-events-none w-[calc(100%-2rem)] sm:w-auto max-w-[350px]">
      <AnimatePresence mode="wait">
        {currentAlert && (
          <motion.div
            key={currentAlert.id}
            initial={{ opacity: 0, y: 50, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: -50, scale: 0.9, filter: 'blur(5px)' }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="pointer-events-auto"
          >
            <div className="relative overflow-hidden rounded-2xl bg-[#0A0A0A]/80 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-4 group cursor-pointer hover:border-white/20 transition-colors">
              
              {/* Animated Premium Glare */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              
              <div className="relative z-10 flex gap-4 items-start">
                
                {/* Dynamic Icon Box */}
                <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center border ${currentAlert.action.bg} ${currentAlert.action.border}`}>
                   {Icon && <Icon className={`w-6 h-6 ${currentAlert.action.color}`} />}
                </div>
                
                {/* Content */}
                <div className="flex-col flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-xs font-bold text-white/90 truncate">
                      {currentAlert.name} <span className="text-white/40 font-medium">from</span> {currentAlert.city}
                    </span>
                    <Sparkles className="w-3 h-3 text-yellow-500 shrink-0" />
                  </div>
                  
                  <div className="text-[13px] leading-tight mb-1">
                    <span className={`${currentAlert.action.color} font-medium`}>{currentAlert.action.text}</span>{" "}
                    <span className="font-black text-white truncate inline-block max-w-[120px] align-bottom">
                      {currentAlert.product}
                    </span>
                  </div>
                  
                  <div className="text-[9px] font-black uppercase tracking-widest text-white/30">
                    {currentAlert.timeAgo}
                  </div>
                </div>
                
                {/* Pulsing indicator */}
                <div className="absolute top-4 right-4 flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-current ${currentAlert.action.color}`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 bg-current ${currentAlert.action.color}`}></span>
                </div>
                
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LiveBuyAlerts;
