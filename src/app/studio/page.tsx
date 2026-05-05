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
      <div className="bg-tbc-black text-white px-4 md:px-8 py-4 pt-[80px] flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-tbc-grey-700">
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-3 md:gap-4">
            <span
              className="text-lg md:text-xl tracking-[-0.02em]"
              style={{ fontFamily: "var(--font-bodoni)", fontStyle: "italic", fontWeight: 400 }}
            >
              Tbc
            </span>
            <span className="w-px h-4 md:h-5 bg-tbc-grey-700" />
            <span className="mono text-tbc-grey-500 text-xs md:text-sm">The Studio</span>
          </div>
          <div className="md:hidden">
            <span className="mono text-tbc-grey-500 text-xs">TTD $7.50/in</span>
          </div>
        </div>
        <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
          <span className="text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-tbc-grey-500">
            <span className="text-green-400">●</span> Live 3D Preview
          </span>
          <span className="hidden md:inline mono text-tbc-grey-500 text-sm">TTD $7.50/in</span>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row-reverse min-h-[calc(100vh-76px)] lg:h-[calc(100vh-76px)]">

        {/*
          3D Canvas
          Mobile: h-[55svh] (svh = small-viewport-height, excludes browser chrome),
                  sticky top-[80px] keeps it pinned just below the fixed navbar
                  while the user scrolls through the controls panel.
          Desktop: lg:static lg:h-full fills the right column at full height.
        */}
        <div className="w-full h-[55svh] min-h-[260px] sticky top-[80px] lg:top-auto lg:static lg:h-full lg:flex-1 relative z-10">
          <Suspense
            fallback={
              <div className="w-full h-full flex items-center justify-center" style={{ background: "linear-gradient(180deg, #1a1a1a, #0f0f0f)" }}>
                <div className="w-10 h-10 border-2 border-tbc-grey-700 border-t-white rounded-full animate-spin" />
              </div>
            }
          >
            <div className="w-full h-full relative bg-tbc-black">
              <GarmentCanvas />

              {/* Floating controls bar — bottom respects iPhone home-indicator safe area */}
              <div
                className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 md:gap-3 bg-[#0e0e16]/80 backdrop-blur-md px-4 md:px-6 rounded-full border border-white/10 shadow-2xl whitespace-nowrap"
                style={{
                  bottom: "max(1.25rem, env(safe-area-inset-bottom, 1.25rem))",
                  paddingTop: "0.625rem",
                  paddingBottom: "0.625rem",
                }}
              >
                <BottomControls />
              </div>
            </div>
          </Suspense>
        </div>

        {/* Controls Panel — scrollable section below canvas on mobile */}
        <div
          className="w-full lg:w-[380px] xl:w-[420px] bg-[#0e0e16] text-white lg:border-r border-white/10 lg:overflow-y-auto relative z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] lg:shadow-none"
          style={{ paddingBottom: "max(5rem, env(safe-area-inset-bottom, 1.25rem))" }}
        >
          <ControlsPanel />
          <PricingPanel />
        </div>

      </div>
    </div>
  );
}

// Client component wrapper for Zustand state
import { useDesignStore } from "@/store/designStore";
import { Camera, Wind, Rotate3D } from "lucide-react";

function BottomControls() {
  const { autoRotate, setAutoRotate, windEnabled, setWindEnabled } = useDesignStore();

  return (
    <>
      <button
        onClick={() => setAutoRotate(!autoRotate)}
        className={`flex items-center gap-1.5 text-[11px] uppercase tracking-widest transition-colors py-2 px-2 rounded-md active:bg-white/10 ${autoRotate ? "text-white" : "text-white/50"}`}
      >
        <Rotate3D size={15} /> Auto
      </button>
      <div className="w-px h-4 bg-white/20" />
      <button
        onClick={() => setWindEnabled(!windEnabled)}
        className={`flex items-center gap-1.5 text-[11px] uppercase tracking-widest transition-colors py-2 px-2 rounded-md active:bg-white/10 ${windEnabled ? "text-white" : "text-white/50"}`}
      >
        <Wind size={15} /> Wind
      </button>
      <div className="w-px h-4 bg-white/20" />
      <button
        onClick={() => window.dispatchEvent(new Event("tbc:export-mockup"))}
        className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-white/80 py-2 px-2 rounded-md active:bg-white/10 transition-colors"
      >
        <Camera size={15} /> 2K
      </button>
    </>
  );
}
