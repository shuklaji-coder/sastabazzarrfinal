import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

export const FlashSaleTimer = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ hours: 2, minutes: 45, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.hours === 0 && prev.minutes === 0 && prev.seconds === 0) {
          return { hours: 2, minutes: 59, seconds: 59 }; // Reset for demo
        }
        
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours--;
            }
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const TimeUnit = ({ value, label }: { value: number; label: string }) => {
    const formattedValue = value.toString().padStart(2, '0');
    
    return (
      <div className="flex flex-col items-center group">
        <div className="relative overflow-hidden bg-[#121212]/80 backdrop-blur-2xl px-3 py-2 rounded-[1.5rem] border border-red-500/20 shadow-[0_10px_40px_rgba(0,0,0,0.6),inset_0_0_15px_rgba(255,255,255,0.02)] flex items-center gap-1.5 group-hover:border-red-500/50 transition-all duration-500">
          
          <div className="flex gap-1.5">
            {formattedValue.split('').map((digit, i) => (
              <div key={i} className="relative w-9 h-12 md:w-14 md:h-20 flex items-center justify-center bg-gradient-to-b from-[#1A1A1A] to-[#0A0A0A] rounded-2xl overflow-hidden border border-white/5 shadow-xl">
                 <AnimatePresence mode="popLayout">
                    <motion.span
                      key={digit}
                      initial={{ y: 25, opacity: 0, filter: 'blur(8px)' }}
                      animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                      exit={{ y: -25, opacity: 0, filter: 'blur(8px)' }}
                      transition={{ type: 'spring', damping: 12, stiffness: 150 }}
                      className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-red-100 to-red-400 drop-shadow-[0_2px_10px_rgba(239,68,68,0.3)]"
                    >
                      {digit}
                    </motion.span>
                 </AnimatePresence>
                 
                 {/* Internal premium accents */}
                 <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                 <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-white/5 to-transparent" />
              </div>
            ))}
          </div>

          {/* Aggressive Red Shine Layer */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[1.5rem]">
            <motion.div 
              animate={{ x: ['-200%', '200%'] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut', delay: Math.random() }}
              className="absolute inset-0 bg-gradient-to-tr from-transparent via-red-500/10 to-transparent skew-x-12"
            />
          </div>
        </div>
        
        <div className="mt-3">
           <motion.span 
             initial={{ opacity: 0.6 }}
             animate={{ opacity: [0.6, 1, 0.6] }}
             transition={{ repeat: Infinity, duration: 1.5 }}
             className="text-[10px] md:text-[11px] font-black text-red-500 uppercase tracking-[0.4em] block drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]"
           >
             {label}
           </motion.span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex items-center gap-5 md:gap-8 bg-[#080808]/90 backdrop-blur-3xl p-6 md:p-8 rounded-[3rem] border border-red-500/10 shadow-[0_0_80px_rgba(239,68,68,0.1)]">
      <TimeUnit value={timeLeft.hours} label="Hours" />
      <div className="flex flex-col gap-3 mt-[-28px]">
        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.8)]" />
        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }} className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-red-800 shadow-[0_0_10px_rgba(185,28,28,0.4)]" />
      </div>
      <TimeUnit value={timeLeft.minutes} label="Minutes" />
      <div className="flex flex-col gap-3 mt-[-28px]">
        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.8)]" />
        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }} className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-red-800 shadow-[0_0_10px_rgba(185,28,28,0.4)]" />
      </div>
      <TimeUnit value={timeLeft.seconds} label="Seconds" />
    </div>
  );
};
