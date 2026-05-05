"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { ControlsPanel } from "@/components/studio/ControlsPanel";
import { PricingPanel } from "@/components/studio/PricingPanel";

const GarmentCanvas = dynamic(
  () => import("@/components/studio/GarmentCanvas").then((m) => ({ default: m.GarmentCanvas })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center" style={{ background: "linear-gradient(180deg, #1a1a1a, #0f0f0f)" }}>
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-tbc-grey-700 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="mono text-tbc-grey-500">Loading 3D Studio...</p>
        </div>
      </div>
    ),
  }
);

export default function StudioPage() {
  return (
    <div className="pt-0 min-h-screen bg-tbc-black">
      {/* Header Bar */}
      <div className="bg-tbc-black text-white px-5 md:px-8 py-4 pt-20 flex items-center justify-between border-b border-tbc-grey-700">
        <div className="flex items-center gap-4">
          <span
            className="text-xl tracking-[-0.02em]"
            style={{ fontFamily: "'Bodoni Moda', serif", fontStyle: "italic", fontWeight: 700 }}
          >
            Tbc
          </span>
          <span className="w-px h-5 bg-tbc-grey-700" />
          <span className="mono text-tbc-grey-500">The Studio</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] tracking-[0.2em] uppercase text-tbc-grey-500">
            <span className="text-green-400">●</span> Live 3D Preview
          </span>
          <span className="mono text-tbc-grey-500">TTD $7.50/in</span>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row" style={{ height: "calc(100vh - 76px)" }}>
        {/* 3D Canvas — Left/Main */}
        <div className="flex-1 relative">
          <Suspense
            fallback={
              <div className="w-full h-[60vh] lg:h-full flex items-center justify-center" style={{ background: "linear-gradient(180deg, #1a1a1a, #0f0f0f)" }}>
                <div className="w-10 h-10 border-2 border-tbc-grey-700 border-t-white rounded-full animate-spin" />
              </div>
            }
          >
            <div className="h-[60vh] lg:h-full">
              <GarmentCanvas />
            </div>
          </Suspense>
        </div>

        {/* Controls Panel — Right/Bottom */}
        <div className="w-full lg:w-[380px] xl:w-[420px] bg-tbc-white border-l border-tbc-grey-200 overflow-y-auto max-h-[40vh] lg:max-h-none">
          <ControlsPanel />
          <PricingPanel />
        </div>
      </div>
    </div>
  );
}
