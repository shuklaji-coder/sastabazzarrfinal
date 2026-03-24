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
        <div className="relative overflow-hidden bg-white/[0.05] backdrop-blur-2xl px-2 py-1 rounded-[1.25rem] border border-white/[0.1] shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_0_10px_rgba(255,255,255,0.05)] flex items-center gap-1 group-hover:border-primary/40 transition-all duration-500">
          
          <div className="flex gap-1">
            {formattedValue.split('').map((digit, i) => (
              <div key={i} className="relative w-8 h-10 md:w-12 md:h-16 flex items-center justify-center bg-black/40 rounded-xl overflow-hidden border border-white/5">
                 <AnimatePresence mode="popLayout">
                    <motion.span
                      key={digit}
                      initial={{ y: 20, opacity: 0, filter: 'blur(5px)' }}
                      animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                      exit={{ y: -20, opacity: 0, filter: 'blur(5px)' }}
                      transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                      className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/30"
                    >
                      {digit}
                    </motion.span>
                 </AnimatePresence>
                 
                 {/* Internal gradient for depth */}
                 <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none" />
                 <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              </div>
            ))}
          </div>

          {/* Premium Shine Layer */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[1.25rem]">
            <motion.div 
              animate={{ x: ['-200%', '200%'] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'linear', delay: Math.random() }}
              className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent skew-x-12"
            />
          </div>
        </div>
        
        <div className="overflow-hidden mt-2">
           <motion.span 
             initial={{ opacity: 0.5 }}
             animate={{ opacity: [0.5, 1, 0.5] }}
             transition={{ repeat: Infinity, duration: 2 }}
             className="text-[10px] md:text-xs font-black text-primary uppercase tracking-[0.3em] block"
           >
             {label}
           </motion.span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex items-center gap-4 md:gap-6 bg-black/20 backdrop-blur-3xl p-4 md:p-6 rounded-[2.5rem] border border-white/[0.05] shadow-2xl">
      <TimeUnit value={timeLeft.hours} label="Hours" />
      <div className="flex flex-col gap-2 mt-[-20px]">
        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.5 }} className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary/40 shadow-[0_0_5px_rgba(var(--primary),0.2)]" />
      </div>
      <TimeUnit value={timeLeft.minutes} label="Minutes" />
      <div className="flex flex-col gap-2 mt-[-20px]">
        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.5 }} className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary/40 shadow-[0_0_5px_rgba(var(--primary),0.2)]" />
      </div>
      <TimeUnit value={timeLeft.seconds} label="Seconds" />
    </div>
  );
};
