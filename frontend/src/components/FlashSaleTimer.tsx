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

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="relative overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 rounded-lg w-12 h-14 md:w-16 md:h-20 flex items-center justify-center mb-1 shadow-inner">
        <AnimatePresence mode="wait">
          <motion.span
            key={value}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-2xl md:text-4xl font-black text-white"
          >
            {value.toString().padStart(2, '0')}
          </motion.span>
        </AnimatePresence>
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
      </div>
      <span className="text-[10px] md:text-xs font-bold text-white/60 uppercase tracking-widest">{label}</span>
    </div>
  );

  return (
    <div className="flex items-center gap-3 md:gap-4">
      <TimeUnit value={timeLeft.hours} label="Hrs" />
      <span className="text-2xl md:text-4xl font-black text-white/40 mb-6">:</span>
      <TimeUnit value={timeLeft.minutes} label="Min" />
      <span className="text-2xl md:text-4xl font-black text-white/40 mb-6">:</span>
      <TimeUnit value={timeLeft.seconds} label="Sec" />
    </div>
  );
};
