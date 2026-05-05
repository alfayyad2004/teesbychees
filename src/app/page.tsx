"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { getFeaturedProducts } from "@/lib/data";
import { ProductCard } from "@/components/shop/ProductCard";

/* ─── Editorial Images ─── */
const lookbookItems = [
  { name: "Sinner — SS24", image: "/editorial/slot-machine.jpg", span: "col-span-5 row-span-5", bg: "linear-gradient(135deg, #1a1a1a, #2a0a0a)" },
  { name: "Tennis Club — 2023", image: "/editorial/tennis-club.jpg", span: "col-span-4 row-span-3", bg: "linear-gradient(135deg, #f4f3f1, #d8d6d3)" },
  { name: "Comic Pop — Kablam!", image: "/editorial/comic-pop.jpg", span: "col-span-3 row-span-5", bg: "linear-gradient(180deg, #0a1a2a, #001020)" },
  { name: "Windows 98 — Y2K", image: "/editorial/windows-98.jpg", span: "col-span-4 row-span-2", bg: "linear-gradient(135deg, #2a2a2a, #0a0a0a)" },
  { name: "Tom & Jerry — Retro", image: "/editorial/tom-jerry.jpg", span: "col-span-3 row-span-3", bg: "linear-gradient(135deg, #c8c4be, #a8a4a0)" },
  { name: "Slot Machine — Hear Yours", image: "/editorial/slot-machine.jpg", span: "col-span-6 row-span-3", bg: "linear-gradient(135deg, #1a0a1a, #0a0010)" },
];

const categories = [
  { name: "Tees", href: "/shop/t-shirts", num: "01", color: "#0a0a0a", bg: "linear-gradient(180deg, #ededed, #d8d8d8)" },
  { name: "Hoodies", href: "/shop/hoodies", num: "02", color: "#fff", bg: "linear-gradient(180deg, #1a1a1a, #0a0a0a)" },
  { name: "Long Sleeve", href: "/shop/long-sleeves", num: "03", color: "#0a0a0a", bg: "linear-gradient(180deg, #c4c4c4, #a8a8a8)" },
  { name: "Jerseys", href: "/shop/jerseys", num: "04", color: "#fff", bg: "linear-gradient(180deg, #2a2a2a, #1a1a1a)" },
  { name: "Polos", href: "/shop/polos", num: "05", color: "#0a0a0a", bg: "linear-gradient(180deg, #f4f3f1, #e8e6e3)" },
];

export default function HomePage() {
  const featured = getFeaturedProducts();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <>
      {/* ═══════════════════ HERO ═══════════════════ */}
      <section ref={heroRef} className="min-h-screen relative grid grid-cols-1 lg:grid-cols-2 overflow-hidden" style={{ background: "#f4f3f1" }}>
        {/* Left — Text */}
        <div
          className="relative z-10 flex flex-col justify-between p-6 pt-24 md:p-12 md:pt-32"
        >
          <div>
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3"
            >
              <span style={{ width: "6px", height: "6px", background: "#0a0a0a", borderRadius: "50%" }} />
              <span className="mono">SS · 2026 · Trinidad</span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              style={{
                fontFamily: "'Bodoni Moda', serif",
                fontWeight: 900,
                fontSize: "clamp(80px, 13vw, 200px)",
                letterSpacing: "-0.04em",
                lineHeight: 0.85,
                marginTop: "24px",
                fontVariationSettings: '"opsz" 96',
                fontOpticalSizing: "auto",
                position: "relative",
                zIndex: 1,
              }}
            >
              Wear<br />
              <span style={{ fontStyle: "italic", fontWeight: 400 }}>yours.</span>
            </motion.h1>

            {/* Meta — description + N° directly under title */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex-col md:flex-row gap-4"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                marginTop: "40px",
                position: "relative",
                zIndex: 10,
              }}
            >
              <p style={{
                maxWidth: "320px",
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: "13px",
                lineHeight: 1.5,
                color: "#333",
              }}>
                Custom apparel built around your graphics. Upload,
                place, preview in 3D — pay only when it&apos;s exactly right.
              </p>
              <div className="hidden md:block" style={{ textAlign: "right" }}>
                <div className="mono" style={{ color: "#8a8a8a", marginBottom: "8px" }}>N° 001</div>
                <div className="mono">EST. 2023</div>
              </div>
            </motion.div>
          </div>

          {/* CTA at bottom */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-12 md:mt-0"
          >
            <Link href="/studio" className="btn-editorial">
              Open the Studio <span style={{ fontFamily: "'Bodoni Moda', serif" }}>→</span>
            </Link>
          </motion.div>
        </div>

        {/* Right — Dark panel with product */}
        <div className="relative overflow-hidden min-h-[420px] lg:min-h-0" style={{ background: "#0a0a0a" }}>
          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.08), transparent 60%), linear-gradient(180deg, #0a0a0a, #1a1a1a)",
            }}
          />

          {/* Hero Product */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute flex items-center justify-center"
            style={{
              top: "50%", left: "50%", transform: "translate(-50%, -55%)",
              width: "70%", aspectRatio: "3/4",
              background: "linear-gradient(135deg, #1f1f1f, #0a0a0a)",
              border: "1px solid #2a2a2a",
            }}
          >
            <div className="tee-silhouette relative" style={{ width: "70%", aspectRatio: "1", background: "#fff" }}>
              <span
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{
                  fontFamily: "'Bodoni Moda', serif",
                  fontWeight: 900,
                  fontSize: "64px",
                  color: "#0a0a0a",
                  letterSpacing: "-0.04em",
                }}
              >
                TBC
              </span>
            </div>
          </motion.div>

          {/* Marquee */}
          <div className="absolute whitespace-nowrap overflow-hidden" style={{ bottom: "60px", left: "-10%", right: "-10%" }}>
            <div style={{ display: "inline-flex", animation: "marquee 40s linear infinite" }}>
              {Array(6).fill(null).map((_, i) => (
                <span
                  key={i}
                  style={{
                    margin: "0 40px",
                    fontFamily: "'Bodoni Moda', serif",
                    fontStyle: "italic",
                    fontWeight: 700,
                    fontSize: "80px",
                    color: "#fff",
                    opacity: 0.95,
                  }}
                >
                  Wear Yours <span style={{ opacity: 0.5 }}>✦</span>{" "}
                  Design It <span style={{ opacity: 0.5 }}>✦</span>{" "}
                  Print It <span style={{ opacity: 0.5 }}>✦</span>{" "}
                  Own It <span style={{ opacity: 0.5 }}>✦</span>{" "}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ TICKER ═══════════════════ */}
      <div className="ticker">
        <div className="ticker-track">
          <span>Free design preview</span>
          <span>Cart held 5 days</span>
          <span>$7.50 TTD per inch</span>
          <span>No account needed to design</span>
          <span>Shipped from San Fernando</span>
          <span>Free design preview</span>
          <span>Cart held 5 days</span>
          <span>$7.50 TTD per inch</span>
          <span>No account needed to design</span>
          <span>Shipped from San Fernando</span>
        </div>
      </div>

      {/* ═══════════════════ CATEGORIES ═══════════════════ */}
      <section className="section-editorial">
        <div className="section-head">
          <h2 className="display" style={{ fontSize: "clamp(40px, 6vw, 88px)" }}>
            Shop<br /><span className="display-ital">the cuts.</span>
          </h2>
          <span className="section-num">N° 02 — Categories</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link href={cat.href} className="block group no-underline">
                <div
                  className="aspect-[3/4] relative overflow-hidden transition-transform duration-600 group-hover:scale-[0.98]"
                  style={{ background: cat.bg }}
                >
                  {/* Tee silhouette */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] aspect-square">
                    <div
                      className="tee-silhouette w-full h-full opacity-85"
                      style={{ background: cat.color }}
                    />
                  </div>

                  {/* Info */}
                  <div className="absolute bottom-5 left-5 right-5 flex justify-between items-end" style={{ color: cat.color }}>
                    <span
                      className="text-[22px] tracking-[-0.01em]"
                      style={{ fontFamily: "'Bodoni Moda', serif", fontStyle: "italic", fontWeight: 400 }}
                    >
                      {cat.name}
                    </span>
                    <span className="text-[12px] tracking-[0.15em] uppercase">
                      {cat.num} →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════ FEATURED PRODUCTS ═══════════════════ */}
      <section className="section-editorial" style={{ background: "var(--color-tbc-soft)" }}>
        <div className="section-head">
          <h2 className="display" style={{ fontSize: "clamp(40px, 6vw, 88px)" }}>
            New<br /><span className="display-ital">arrivals.</span>
          </h2>
          <span className="section-num">N° 03 — Featured</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {featured.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/shop" className="btn-editorial-outline">
            View all products →
          </Link>
        </div>
      </section>

      {/* ═══════════════════ STUDIO PROMO ═══════════════════ */}
      <section className="bg-tbc-black text-white overflow-hidden" style={{ padding: "120px 32px" }} id="studio">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 max-w-7xl mx-auto items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <span className="mono text-tbc-grey-500">N° 04 — The Studio</span>
            <h3
              className="display mt-6"
              style={{ fontSize: "clamp(48px, 7vw, 120px)" }}
            >
              Design.<br />
              <span className="display-ital">In three</span><br />
              dimensions.
            </h3>
            <p className="text-[15px] leading-[1.6] max-w-[460px] mt-8 text-tbc-grey-300">
              Drop your graphic. Drag it onto the garment. Rotate, zoom, resize.
              See exactly what you&apos;re paying for before a single thread is
              printed.
            </p>

            {/* Steps */}
            <ul className="mt-8 list-none">
              {[
                { step: "01 — Pick a garment", detail: "Tee, hoodie, jersey…" },
                { step: "02 — Upload your graphic", detail: "PNG, JPG, SVG" },
                { step: "03 — Place & resize in 3D", detail: "Live preview" },
                { step: "04 — See the price update", detail: "$7.50 / inch TTD" },
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex justify-between py-4 border-t border-tbc-grey-700 text-[13px] tracking-[0.1em] uppercase"
                >
                  <span>{item.step}</span>
                  <span
                    className="text-tbc-grey-500"
                    style={{ fontFamily: "'Bodoni Moda', serif", fontStyle: "italic", textTransform: "none", letterSpacing: "normal" }}
                  >
                    {item.detail}
                  </span>
                </li>
              ))}
              <li className="border-b border-tbc-grey-700" />
            </ul>

            <Link href="/studio" className="btn-editorial-white mt-10">
              Open Studio <span style={{ fontFamily: "'Bodoni Moda', serif" }}>→</span>
            </Link>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="aspect-square border border-tbc-grey-700 relative flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #1a1a1a, #0a0a0a)" }}
          >
            {/* Badge */}
            <span className="absolute top-5 left-5 text-[10px] tracking-[0.2em] uppercase text-tbc-grey-500">
              <span className="text-green-400">●</span> Live 3D Preview
            </span>

            {/* 3D preview placeholder */}
            <div className="text-center">
              <div className="tee-silhouette w-48 h-48 bg-white mx-auto flex items-center justify-center">
                <span
                  className="text-tbc-black text-4xl"
                  style={{ fontFamily: "'Bodoni Moda', serif", fontWeight: 900 }}
                >
                  Tbc
                </span>
              </div>
              <p className="mono text-tbc-grey-500 mt-6">Drag to rotate · Scroll to zoom</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ PRICING CALCULATOR ═══════════════════ */}
      <section className="section-editorial" style={{ background: "var(--color-tbc-soft)" }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 max-w-7xl mx-auto">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="mono text-tbc-mute">N° 05 — The Math</span>
            <h3
              className="display mt-6"
              style={{ fontSize: "clamp(40px, 5vw, 72px)" }}
            >
              Honest<br /><span className="display-ital">pricing.</span>
            </h3>
            <p className="text-[14px] leading-[1.6] mt-6 max-w-[420px] text-tbc-grey-600">
              One rule, no surprises. Seven dollars and fifty cents Trinidad per
              inch of the longest side of your graphic. The bigger you print it,
              the more it costs.
            </p>
            <p className="text-[12px] text-tbc-mute mt-6">
              Calculator built into every product page and the 3D Studio.
            </p>
          </motion.div>

          {/* Calculator Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <InlineCalculator />
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ LOOKBOOK ═══════════════════ */}
      <section className="section-editorial">
        <div className="section-head">
          <h2 className="display" style={{ fontSize: "clamp(40px, 6vw, 88px)" }}>
            The<br /><span className="display-ital">archive.</span>
          </h2>
          <span className="section-num">N° 06 — Lookbook</span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-6 md:grid-cols-12 gap-1 auto-rows-[70px] md:auto-rows-[80px]">
          {lookbookItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className={`relative overflow-hidden cursor-pointer group ${
                i === 0 ? "col-span-6 md:col-span-5 row-span-4 md:row-span-5" :
                i === 1 ? "col-span-3 md:col-span-4 row-span-3" :
                i === 2 ? "col-span-3 row-span-3 md:row-span-5" :
                i === 3 ? "col-span-3 md:col-span-4 row-span-2" :
                i === 4 ? "col-span-3 row-span-3" :
                "col-span-6 row-span-3"
              }`}
            >
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500" />
              <span className="absolute bottom-3 left-3 text-[10px] tracking-[0.2em] uppercase text-white/90 z-10">
                {item.name}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/lookbook" className="btn-editorial-outline">
            View full lookbook →
          </Link>
        </div>
      </section>
    </>
  );
}

/* ─── INLINE CALCULATOR COMPONENT ─── */
function InlineCalculator() {
  const { useState } = require("react");
  const [length, setLength] = useState(8);
  const RATE = 7.5;
  const total = length * RATE;

  return (
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
  );
}
