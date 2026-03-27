"use client";

import { Star, ShieldCheck, Zap } from "lucide-react";
import { DealState } from "@/lib/bargaining-engine";

interface BargainingProductCardProps {
  product: any;
  currentPrice: number;
  dealState: DealState;
}

export function BargainingProductCard({ product, currentPrice, dealState }: BargainingProductCardProps) {
  const images = product?.images && product.images.length > 0 ? product.images : ['https://via.placeholder.com/600?text=Premium+Earbuds'];
  const mrp = product?.sellingPrice || product?.price || 1499;

  let badgeColor = "bg-primary/20 text-primary border-primary/30";
  let badgeText = "Negotiating...";

  if (dealState === "final-offer") {
    badgeColor = "bg-warning/20 text-warning border-warning/30";
    badgeText = "Final Offer 🔥";
  } else if (dealState === "deal-locked" || dealState === "deal-success") {
    badgeColor = "bg-success/20 text-success border-success/30 animate-pulse";
    badgeText = "Deal Success 🎉";
  } else if (dealState === "deal-failed") {
    badgeColor = "bg-destructive/20 text-destructive border-destructive/30";
    badgeText = "Deal Failed ❌";
  }

  return (
    <div className="relative group w-full h-full p-[1px] rounded-3xl overflow-hidden bg-gradient-to-b from-white/20 to-white/5 shadow-[0_0_40px_rgba(255,255,255,0.05)]">
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <div className="relative h-full bg-black/60 backdrop-blur-xl rounded-[23px] border border-white/10 flex flex-col overflow-hidden">
        {/* Top Badges */}
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <div className={`px-3 py-1.5 rounded-full border text-xs font-bold backdrop-blur-md shadow-lg ${badgeColor} flex items-center gap-1.5`}>
            {badgeText}
          </div>
        </div>

        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md border border-white/10 px-2 py-1.5 rounded-lg">
            <Star className="w-3.5 h-3.5 fill-warning text-warning" />
            <span className="text-white font-bold text-xs">4.8</span>
          </div>
        </div>
        
        {/* Product Image Stage */}
        <div className="relative flex-1 min-h-[50%] flex items-center justify-center p-8 overflow-hidden bg-gradient-to-b from-black/20 to-transparent">
          {/* Subtle glow behind image */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,165,0,0.1)_0%,transparent_60%)] pointer-events-none" />
          
          <img 
            src={images[0]} 
            alt={product?.name || "Premium Item"} 
            className="w-full h-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-700 ease-out z-10"
          />
        </div>

        {/* Content Area */}
        <div className="relative flex-none p-6 md:p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent border-t border-white/5">
          <h2 className="text-2xl md:text-4xl font-display font-bold text-white mb-2 leading-tight">
            {product?.name || "Product"}
          </h2>
          
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck className="w-4 h-4 text-success" />
            <span className="text-sm font-medium text-white/60">SastaaBazaar Original • 100% Verified</span>
          </div>

          {/* Pricing Block */}
          <div className="flex flex-col gap-1 mb-6">
            <span className="text-sm text-white/40 font-medium tracking-wider uppercase">Current AI Deal Price</span>
            <div className="flex justify-between items-end">
              <div className="flex items-end gap-3">
                <span className="text-5xl md:text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFB347] to-[#FFCC33]">
                  ₹{Intl.NumberFormat("en-IN").format(currentPrice)}
                </span>
                <span className="text-xl md:text-2xl text-white/30 line-through font-medium mb-1.5">
                  ₹{Intl.NumberFormat("en-IN").format(mrp)}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-success font-bold text-sm bg-success/10 px-2 py-1 rounded border border-success/20 mb-1.5">
                <Zap className="w-3 h-3" />
                <span>Save {Math.round(((mrp - currentPrice) / mrp) * 100)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
