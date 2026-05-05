"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const RATE = 7.5;

export default function CalculatorPage() {
  const [length, setLength] = useState(8);
  const total = length * RATE;

  return (
    <div className="pt-24 pb-20">
      <section className="section-editorial" style={{ background: "var(--color-tbc-soft)" }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="mono text-tbc-mute">N° 04 — The Math</span>
            <h1
              className="display mt-6"
              style={{ fontSize: "clamp(48px, 6vw, 88px)" }}
            >
              Honest<br /><span className="display-ital">pricing.</span>
            </h1>
            <p className="text-[14px] leading-[1.6] mt-8 max-w-[420px] text-tbc-grey-600">
              One rule, no surprises. Seven dollars and fifty cents Trinidad per
              inch of the longest side of your graphic. The bigger you print it,
              the more it costs. Drag the slider — watch it live.
            </p>
            <p className="text-[12px] text-tbc-mute mt-6">
              Calculator built into every product page and the 3D Studio.
            </p>

            <Link href="/studio" className="btn-editorial mt-10">
              Open the Studio <span className="arrow">→</span>
            </Link>
          </motion.div>

          {/* Calculator Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="bg-white border border-tbc-black p-8 md:p-10">
              <label className="mono text-tbc-mute mb-4 block">
                Graphic length (longest side)
              </label>

              {/* Slider Row */}
              <div className="flex items-center gap-5 mb-8">
                <input
                  type="range"
                  min={1}
                  max={20}
                  step={0.25}
                  value={length}
                  onChange={(e) => setLength(parseFloat(e.target.value))}
                  className="flex-1 h-px bg-tbc-black appearance-none outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:bg-tbc-black [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                />
                <input
                  type="number"
                  min={1}
                  max={20}
                  step={0.25}
                  value={length}
                  onChange={(e) =>
                    setLength(Math.min(20, Math.max(1, parseFloat(e.target.value) || 1)))
                  }
                  className="w-[90px] p-2.5 border border-tbc-black text-right text-[18px] outline-none"
                  style={{ fontFamily: "'Bodoni Moda', serif" }}
                />
                <span className="text-[13px] text-tbc-mute">in</span>
              </div>

              {/* Readout */}
              <div className="mt-8 pt-8 border-t border-tbc-line">
                <div className="flex justify-between py-2 text-[13px] text-tbc-grey-500">
                  <span>Length</span>
                  <span>{length.toFixed(2)} in</span>
                </div>
                <div className="flex justify-between py-2 text-[13px] text-tbc-grey-500">
                  <span>Rate</span>
                  <span>TTD $7.50 / in</span>
                </div>

                {/* Total */}
                <div className="mt-4 pt-4 border-t border-tbc-line flex justify-between items-baseline">
                  <span className="mono">Print cost</span>
                  <span style={{ fontFamily: "'Bodoni Moda', serif", fontWeight: 900, fontSize: "56px", letterSpacing: "-0.03em" }}>
                    <span className="text-[18px] font-normal align-top mr-1.5">TTD$</span>
                    {total.toFixed(2)}
                  </span>
                </div>
              </div>

              <Link href="/studio" className="btn-editorial mt-8">
                Start designing <span className="arrow">→</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Rate Table */}
      <section className="section-editorial">
        <div className="max-w-3xl mx-auto">
          <h3
            className="display mb-12"
            style={{ fontSize: "clamp(32px, 4vw, 56px)" }}
          >
            Quick<br /><span className="display-ital">reference.</span>
          </h3>

          <div className="border-t border-tbc-line">
            {[
              { size: '4"', cost: "30.00" },
              { size: '6"', cost: "45.00" },
              { size: '8"', cost: "60.00" },
              { size: '10"', cost: "75.00" },
              { size: '12"', cost: "90.00" },
              { size: '14"', cost: "105.00" },
              { size: '16"', cost: "120.00" },
              { size: '18"', cost: "135.00" },
              { size: '20"', cost: "150.00" },
            ].map((row) => (
              <div
                key={row.size}
                className="flex justify-between items-baseline py-4 border-b border-tbc-grey-100"
              >
                <span className="text-[13px] tracking-[0.1em] uppercase text-tbc-grey-500">{row.size} longest side</span>
                <span
                  className="text-[20px] tracking-[-0.02em]"
                  style={{ fontFamily: "'Bodoni Moda', serif", fontWeight: 700 }}
                >
                  TTD ${row.cost}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
