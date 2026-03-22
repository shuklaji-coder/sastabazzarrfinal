import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Sparkles, X } from 'lucide-react';

const WelcomeGreeting = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if already welcomed in this session
    const alreadyWelcomed = sessionStorage.getItem('sb_welcomed');
    if (alreadyWelcomed) return;

    // Small delay for page to load first
    const timer = setTimeout(() => {
      setShow(true);
      sessionStorage.setItem('sb_welcomed', 'true');

      // Speak the welcome message
      speakWelcome();

      // Auto-hide after 6 seconds
      setTimeout(() => setShow(false), 6000);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const speakWelcome = () => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(
        'Welcome to Sasta Bazaar! Enjoy your shopping!'
      );
      utterance.lang = 'en-IN';
      utterance.rate = 0.95;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;

      // Try to use a female Indian English voice if available
      const loadVoicesAndSpeak = () => {
        const voices = window.speechSynthesis.getVoices();
        const indianVoice = voices.find(v =>
          v.lang.includes('en-IN') || v.lang.includes('hi-IN')
        );
        const femaleVoice = voices.find(v =>
          v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('google')
        );
        if (indianVoice) utterance.voice = indianVoice;
        else if (femaleVoice) utterance.voice = femaleVoice;

        window.speechSynthesis.speak(utterance);
      };

      // Voices may load async
      if (window.speechSynthesis.getVoices().length > 0) {
        loadVoicesAndSpeak();
      } else {
        window.speechSynthesis.onvoiceschanged = loadVoicesAndSpeak;
      }
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -80, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -80, scale: 0.8 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] w-[90vw] max-w-md"
        >
          <div className="relative bg-gradient-to-r from-[#0a0f2c]/95 via-[#0d1235]/95 to-[#0a0f2c]/95 backdrop-blur-2xl border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.2),0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden">
            {/* Animated top gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 animate-pulse" />

            <div className="p-5 flex items-center gap-4">
              {/* Animated icon */}
              <motion.div
                animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.4)] flex-shrink-0"
              >
                <ShoppingBag className="w-7 h-7 text-white" />
              </motion.div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">
                    Welcome to SastaaBazaar!
                  </h3>
                  <motion.div
                    animate={{ rotate: [0, 20, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                  </motion.div>
                </div>
                <p className="text-sm text-white/50 mt-0.5">
                  🛍️ Enjoy your shopping! Best deals await you.
                </p>
              </div>

              {/* Close button */}
              <button
                onClick={() => setShow(false)}
                className="p-1.5 rounded-full hover:bg-white/10 transition-colors text-white/30 hover:text-white flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Bottom sparkle particles */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-12 opacity-30">
              {[0, 1, 2].map(i => (
                <motion.span
                  key={i}
                  animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                  className="w-1 h-1 rounded-full bg-cyan-400"
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeGreeting;
