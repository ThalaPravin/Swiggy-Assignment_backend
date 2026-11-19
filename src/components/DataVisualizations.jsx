import React from 'react';
import { TrendingUp, AlertTriangle, ShieldCheck, Check, DollarSign } from 'lucide-react';

export function SavingsCircleRing({ savingsPct, totalSavings }) {
  const strokeDashoffset = 251.2 - (251.2 * Math.min(100, Math.max(0, savingsPct))) / 100;

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-[#0e0e10] border border-[#26262a]">
      <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
        <svg className="w-16 h-16 transform -rotate-90">
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="#26262a"
            strokeWidth="5"
            fill="transparent"
          />
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="#7fc79a"
            strokeWidth="5"
            fill="transparent"
            strokeDasharray="175.9"
            strokeDashoffset={175.9 - (175.9 * Math.min(100, savingsPct)) / 100}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute font-serif text-sm font-bold text-[#ecebe6]">
          {savingsPct}%
        </div>
      </div>

      <div className="space-y-0.5 font-mono text-xs">
        <div className="text-[10px] text-[#8d8c86] uppercase tracking-wider">Forensic Savings Yield</div>
        <div className="font-serif text-lg text-[#7fc79a] font-bold">₹{totalSavings.toFixed(2)} Saved</div>
        <div className="text-[10px] text-[#8d8c86]">Dineout Deal + Disputed Fees Purged</div>
      </div>
    </div>
  );
}

export function PriceDriftComparisonBar({ items }) {
  const driftItems = items.filter(i => i.catalogStatus === 'PRICE_DRIFT' || i.catalogStatus === 'MRP_VIOLATION');
  if (driftItems.length === 0) {
    return (
      <div className="p-3 rounded-lg bg-[#0e0e10] border border-[#26262a] text-xs font-mono text-[#7fc79a] flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-[#7fc79a]" />
        <span>100% In-Venue Price Parity with Swiggy Dineout Catalog</span>
      </div>
    );
  }

  return (
    <div className="p-3.5 rounded-xl bg-[#0e0e10] border border-[#26262a] space-y-2 font-mono text-xs">
      <div className="flex items-center justify-between text-[10px] text-[#8d8c86] uppercase">
        <span className="flex items-center gap-1.5 text-[#f2b544]">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Real-time Price Drift Visualization</span>
        </span>
        <span>Delta Index</span>
      </div>

      {driftItems.map(item => {
        const delta = item.price - (item.printedMrp || item.catalogPrice);
        const maxPrice = Math.max(item.price, item.printedMrp || item.catalogPrice);
        const catalogPct = Math.round(((item.printedMrp || item.catalogPrice) / maxPrice) * 100);

        return (
          <div key={item.id} className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-[#ecebe6] font-bold">{item.name}</span>
              <span className="text-[#e5533d] font-bold">+₹{delta} ({item.driftDiff || item.mrpDiff})</span>
            </div>

            {/* Visual Bar Comparison */}
            <div className="h-2 w-full bg-[#131315] rounded-full overflow-hidden flex">
              <div 
                className="bg-[#7fc79a] h-full" 
                style={{ width: `${catalogPct}%` }}
                title={`Swiggy Master Price: ₹${item.printedMrp || item.catalogPrice}`}
              />
              <div 
                className="bg-[#e5533d] h-full" 
                style={{ width: `${100 - catalogPct}%` }}
                title={`Paper Markup: ₹${delta}`}
              />
            </div>

            <div className="flex justify-between text-[9px] text-[#8d8c86]">
              <span>Swiggy DB: ₹{item.printedMrp || item.catalogPrice}</span>
              <span className="text-[#e5533d]">Charged: ₹{item.price}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function CameraViewfinderOverlay({ isScanning }) {
  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Corner Brackets */}
      <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#f2b544] opacity-80" />
      <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#f2b544] opacity-80" />
      <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#f2b544] opacity-80" />
      <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#f2b544] opacity-80" />

      {/* Center Target Reticle */}
      {isScanning && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border border-dashed border-[#f2b544] animate-spin opacity-50" />
        </div>
      )}
    </div>
  );
}
