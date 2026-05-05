"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const lookbookItems = [
  { name: "Comic Pop — KABLAM!", image: "/editorial/comic-pop.jpg", collection: "Issue 01 · SS24" },
  { name: "Tom & Jerry — Retro", image: "/editorial/tom-jerry.jpg", collection: "Nostalgia · SS24" },
  { name: "Windows 98 — Y2K", image: "/editorial/windows-98.jpg", collection: "Digital · SS24" },
  { name: "Slot Machine — Wear Yours", image: "/editorial/slot-machine.jpg", collection: "Casino · FW24" },
  { name: "Tennis Club — Since 2023", image: "/editorial/tennis-club.jpg", collection: "Sport Club · SS24" },
];

export default function LookbookPage() {
  return (
    <div className="pt-24 pb-20">
      <section className="section-editorial">
        {/* Header */}
        <div className="section-head">
          <h1 className="display" style={{ fontSize: "clamp(40px, 6vw, 88px)" }}>
            The<br /><span className="display-ital">archive.</span>
          </h1>
          <span className="section-num">N° 05 — Lookbook</span>
        </div>

        {/* Full-width Editorial Grid */}
        <div className="space-y-1">
          {lookbookItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className={`relative overflow-hidden group cursor-pointer ${
                i % 3 === 0 ? "aspect-[16/9]" : "aspect-[2/1]"
              }`}
            >
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-1000"
                sizes="100vw"
                priority={i < 2}
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/40 transition-colors duration-700" />

              {/* Info */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 flex justify-between items-end">
                <div>
                  <h3
                    className="text-white text-[28px] md:text-[40px] tracking-[-0.02em] leading-none"
                    style={{ fontFamily: "'Bodoni Moda', serif", fontStyle: "italic", fontWeight: 400 }}
                  >
                    {item.name}
                  </h3>
                  <p className="mono text-white/60 mt-3">{item.collection}</p>
                </div>
                <span className="mono text-white/40 group-hover:text-white/80 transition-colors">
                  View →
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
