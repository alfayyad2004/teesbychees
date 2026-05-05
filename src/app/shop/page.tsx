"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PRODUCTS } from "@/lib/data";
import { ProductCard } from "@/components/shop/ProductCard";

const categoryFilters = [
  { label: "All", value: "all" },
  { label: "Tees", value: "t-shirts" },
  { label: "Hoodies", value: "hoodies" },
  { label: "Long Sleeves", value: "long-sleeves" },
  { label: "Jerseys", value: "jerseys" },
  { label: "Polos", value: "polos" },
];

export default function ShopPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const products = PRODUCTS;

  const filtered =
    activeFilter === "all"
      ? products
      : products.filter((p) => p.category === activeFilter);

  return (
    <div className="pt-24 pb-20">
      <section className="section-editorial">
        {/* Header */}
        <div className="section-head">
          <h1 className="display" style={{ fontSize: "clamp(40px, 6vw, 88px)" }}>
            Shop<br /><span className="display-ital">all.</span>
          </h1>
          <span className="section-num">N° 01 — Collection</span>
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 mb-12">
          {categoryFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={`mono px-5 py-2.5 border transition-all duration-300 cursor-pointer ${
                activeFilter === filter.value
                  ? "bg-tbc-black text-white border-tbc-black"
                  : "bg-transparent text-tbc-mute border-tbc-grey-200 hover:border-tbc-black hover:text-tbc-black"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-tbc-mute text-sm">No products in this category yet.</p>
          </div>
        )}
      </section>
    </div>
  );
}
