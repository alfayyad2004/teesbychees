"use client";

import { useDesignStore } from "@/store/designStore";
import { PRINT_RATE_PER_INCH, GARMENT_TYPES } from "@/lib/types";

const BASE_PRICES: Record<string, number> = {
  "t-shirts": 150,
  hoodies: 350,
  "long-sleeves": 225,
  jerseys: 275,
  polos: 200,
};

export function PricingPanel() {
  const garmentType = useDesignStore((s) => s.garmentType);
  const placements = useDesignStore((s) => s.placements);

  const basePrice = BASE_PRICES[garmentType] || 150;
  const garmentLabel = GARMENT_TYPES.find((g) => g.value === garmentType)?.label || "T-Shirt";

  const placementCosts = placements.map((p) => ({
    zone: p.zone,
    lengthInches: p.lengthInches,
    cost: p.lengthInches * PRINT_RATE_PER_INCH,
  }));

  const totalPrintCost = placementCosts.reduce((sum, p) => sum + p.cost, 0);
  const estimatedTotal = basePrice + totalPrintCost;

  const zoneLabels: Record<string, string> = {
    "front-center": "Front Center",
    "left-chest": "Left Chest",
    back: "Back",
    "left-sleeve": "Left Sleeve",
    "right-sleeve": "Right Sleeve",
  };

  return (
    <div className="border-t border-tbc-grey-100 bg-tbc-grey-50 p-5 md:p-6">
      <h3 className="text-xs uppercase tracking-[0.15em] text-tbc-grey-500 mb-4 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        Live Pricing
      </h3>

      {/* Base Garment */}
      <div className="flex items-center justify-between py-2 text-sm">
        <span className="text-tbc-grey-600">{garmentLabel} (base)</span>
        <span className="font-medium">TTD ${basePrice.toFixed(2)}</span>
      </div>

      {/* Print Cost Breakdown */}
      {placementCosts.length > 0 && (
        <div className="border-t border-tbc-grey-200 mt-2 pt-2">
          {placementCosts.map((p) => (
            <div key={p.zone} className="py-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-tbc-grey-500">{zoneLabels[p.zone]}</span>
                <span className="font-medium">TTD ${p.cost.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-tbc-grey-400 mt-0.5">
                <span>{p.lengthInches.toFixed(2)} in × $7.50/in</span>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between py-2 text-sm border-t border-tbc-grey-200 mt-1">
            <span className="text-tbc-grey-500">Total print cost</span>
            <span className="font-medium">TTD ${totalPrintCost.toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* Grand Total */}
      <div className="border-t-2 border-tbc-black mt-3 pt-3 flex items-center justify-between">
        <span className="text-sm font-medium uppercase tracking-[0.08em]">Estimated Total</span>
        <span className="text-lg font-display font-semibold">
          TTD ${estimatedTotal.toFixed(2)}
        </span>
      </div>

      {/* Rate Info */}
      <p className="text-[10px] text-tbc-grey-400 mt-3 leading-relaxed">
        Print pricing: TTD $7.50 per inch of graphic length (longest side). 
        Updates live as you resize your graphic.
      </p>
    </div>
  );
}
