"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Handshake, Gift } from "lucide-react";
import { BargainingSession } from "@/lib/bargaining-engine";
import { Button } from "@/components/ui/button";

interface BargainingChatProps {
  session: BargainingSession;
  onSendOffer: (offer: number) => void;
  isAiTyping: boolean;
  onGoToCart?: () => void;
}

export function BargainingChat({ session, onSendOffer, isAiTyping, onGoToCart }: BargainingChatProps) {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [session.history, isAiTyping]);

  const handleSend = () => {
    const offer = parseInt(inputValue, 10);
    if (!isNaN(offer) && offer > 0) {
      onSendOffer(offer);
      setInputValue("");
    }
  };

  const handleQuickOffer = (amount: number) => {
    onSendOffer(amount);
  };

  // Generate 3 quick offers based on AI's last offer and Min Threshold
  const quickOffers = [
    Math.floor(session.minThreshold * 0.9), // slight lowball
    session.minThreshold,                   // fair
    Math.floor((session.lastAiOffer + session.minThreshold) / 2) // compromise
  ];

  return (
    <div className="flex flex-col h-full bg-black/60 backdrop-blur-2xl rounded-[24px] border border-white/10 overflow-hidden relative">
      
      {/* Header */}
      <div className="flex-none flex items-center gap-6 p-6 border-b border-white/10 bg-gradient-to-r from-orange-500/10 via-transparent to-transparent">
        <div className="relative">
          <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(249,115,22,0.2)] border-2 border-white/20 relative z-10 transition-transform hover:scale-105 duration-500">
            <img 
              src="/ai-avatar.png" 
              alt="Sharma Ji" 
              className="w-full h-full object-cover" 
            />
          </div>
          {/* Enhanced Glow */}
          <div className="absolute -inset-2 bg-orange-500/20 rounded-[2rem] blur-2xl -z-10 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h3 className="font-display font-black text-white text-2xl tracking-tight">Sharma Ji</h3>
            <span className="bg-success/20 text-success text-[10px] px-2.5 py-1 rounded-lg font-black border border-success/30 uppercase tracking-widest shadow-lg shadow-success/20">Verified</span>
          </div>
          <p className="text-sm text-white/60 font-bold flex items-center gap-2 mt-1.5 opacity-80 uppercase tracking-tighter">
            <span className="w-2.5 h-2.5 rounded-full bg-success shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse" /> Traditional Shopkeeper Agent
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-5 scroll-smooth hide-scrollbar space-y-6">
        {session.history.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex flex-col max-w-[85%] ${msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"} animate-slide-up`}
          >
            <div 
              className={`p-4 rounded-2xl shadow-premium border backdrop-blur-md relative
                ${msg.sender === "user" 
                  ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-tr-sm border-orange-400/50" 
                  : "bg-white/10 text-white/90 rounded-tl-sm border-white/10"
                }`}
            >
              {/* Glass reflection effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent rounded-2xl pointer-events-none" />
              
              <p className="text-[15px] leading-relaxed relative z-10 font-medium">{msg.message}</p>
              
              {msg.price && msg.sender === 'user' && (
                <div className="mt-2 pt-2 border-t border-white/20 flex items-center gap-2 relative z-10">
                  <span className="text-xs text-white/70 font-bold uppercase tracking-wider">Offer</span>
                  <span className="font-display font-bold text-lg">₹{msg.price}</span>
                </div>
              )}
            </div>
            <span className="text-[10px] text-white/40 mt-1.5 font-medium px-1">
              {msg.sender === "user" ? "You" : "Sharma Ji"}
            </span>
          </div>
        ))}

        {isAiTyping && (
          <div className="flex flex-col mr-auto items-start max-w-[85%] animate-fade-in">
            <div className="px-4 py-3 bg-white/10 backdrop-blur-md rounded-2xl rounded-tl-sm border border-white/5 flex gap-1.5 items-center">
              <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area / Action Area */}
      <div className="flex-none p-5 bg-black/40 border-t border-white/5 backdrop-blur-xl relative z-20">
        
        {session.dealState === 'deal-success' && (
          <div className="absolute inset-0 flex items-center justify-center p-5 bg-black/80 backdrop-blur-sm z-30 animate-fade-in">
            <div className="bg-success/20 border border-success/40 rounded-xl p-4 w-full flex flex-col items-center gap-3 text-center shadow-[0_0_30px_rgba(22,163,74,0.3)]">
              <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center text-white mb-1 shadow-lg shadow-success/50 animate-bounce">
                <Gift className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-success text-xl">Deal Locked!</h4>
                <p className="text-sm text-success/80 mt-1 font-medium">Extra coupon code applied in cart.</p>
              </div>
              <Button 
                onClick={onGoToCart}
                className="w-full mt-2 bg-success text-white hover:bg-success/90 font-bold shadow-lg h-12"
              >
                Go to Cart <Handshake className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {session.dealState === 'deal-failed' && (
          <div className="absolute inset-0 flex items-center justify-center p-5 bg-black/80 backdrop-blur-sm z-30 animate-fade-in">
            <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-6 w-full text-center">
              <div className="text-4xl mb-3">🥺</div>
              <h4 className="font-bold text-destructive text-xl mb-1">Deal Cancelled</h4>
              <p className="text-sm text-destructive/80 font-medium">Better luck next time!</p>
            </div>
          </div>
        )}

        {(session.dealState === 'negotiating' || session.dealState === 'final-offer') && !isAiTyping && (
           <div className="space-y-4 animate-slide-up">
              {/* Quick Suggestions */}
              <div className="flex gap-2 w-full overflow-x-auto hide-scrollbar snap-x pb-1">
                {quickOffers.map((amt, i) => (
                  <button 
                    key={i}
                    onClick={() => handleQuickOffer(amt)}
                    className="flex-none snap-start whitespace-nowrap px-4 py-2 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-sm font-bold hover:bg-orange-500 hover:text-white transition-colors"
                  >
                    ₹{amt}
                  </button>
                ))}
                {/* Custom Price Button */}
                <button 
                  onClick={() => {
                    const customPrice = prompt("Enter your custom price:");
                    if (customPrice && !isNaN(parseInt(customPrice)) && parseInt(customPrice) > 0) {
                      handleQuickOffer(parseInt(customPrice));
                    }
                  }}
                  className="flex-none snap-start whitespace-nowrap px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-sm font-bold hover:bg-purple-500 hover:text-white transition-colors"
                >
                  💰 Custom Price
                </button>
              </div>

              {/* Input Form */}
              <div className="flex gap-3">
                <div className="relative flex-1 group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 font-bold text-lg group-focus-within:text-orange-400 transition-colors">₹</span>
                  <input 
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter your offer..."
                    className="w-full h-14 pl-9 pr-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all font-display font-medium text-lg shadow-inner"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSend();
                    }}
                  />
                </div>
                <button 
                  onClick={handleSend}
                  disabled={!inputValue || parseInt(inputValue) <= 0}
                  className="w-14 h-14 shrink-0 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all active:scale-95 border border-orange-400/50"
                >
                  <Send className="w-5 h-5 -ml-0.5" />
                </button>
              </div>
           </div>
        )}
      </div>
    </div>
  );
}
