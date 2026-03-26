"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Timer, Zap } from "lucide-react";

interface HagglingMeterProps {
  currentRound: number;
  maxRounds: number;
  dealState: string;
}

export function HagglingMeter({ currentRound, maxRounds, dealState }: HagglingMeterProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Calculate progress percentage
    let newProgress = 0;
    if (dealState === "deal-success") {
      newProgress = 100;
    } else if (dealState === "deal-failed") {
      newProgress = 0;
    } else {
      newProgress = (currentRound / maxRounds) * 100;
      // Cap at 90% if not success
      if (newProgress > 90) newProgress = 90;
    }

    const timer = setTimeout(() => setProgress(newProgress), 100);
    return () => clearTimeout(timer);
  }, [currentRound, maxRounds, dealState]);

  // Color selection based on progress/state
  let colorClass = "bg-destructive";
  if (dealState === "deal-success") {
    colorClass = "bg-success shadow-[0_0_15px_rgba(22,163,74,0.5)]";
  } else if (progress > 60) {
    colorClass = "bg-warning shadow-[0_0_15px_rgba(234,179,8,0.5)]";
  }

  return (
    <div className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 backdrop-blur-md shadow-premium">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap className={`w-5 h-5 ${dealState === "deal-success" ? "text-success animate-pulse" : "text-primary"}`} />
          <span className="font-display font-bold text-sm text-white">Deal Closeness</span>
        </div>
        <div className="flex items-center gap-1.5 bg-black/50 px-2.5 py-1 rounded-full border border-white/5">
          <Timer className="w-4 h-4 text-warning" />
          <span className="text-xs font-medium text-warning group-hover:animate-pulse">10:00</span>
        </div>
      </div>
      
      <div className="relative h-3 mb-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
        <div 
          className={`h-full transition-all duration-1000 ease-out rounded-full ${colorClass}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs font-medium text-white/50">
        <span>Round {Math.min(currentRound, maxRounds)}/{maxRounds}</span>
        <span>
          {dealState === "deal-success" ? "Deal Locked! 🎉" : 
           dealState === "deal-failed" ? "Deal Cancelled ❌" :
           dealState === "final-offer" ? "Final Offer! 🔥" :
           "Negotiating..."}
        </span>
      </div>
    </div>
  );
}
