"use client";

import { use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { getProductsByCategory, getCategoryLabel } from "@/lib/data";
import { ProductCard } from "@/components/shop/ProductCard";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { category } = use(params);
  const products = getProductsByCategory(category);
  const label = getCategoryLabel(category);

  return (
    <div className="pt-20 md:pt-24">
      {/* Category Header */}
      <section className="px-5 md:px-8 lg:px-12 py-12 md:py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <nav className="text-xs text-tbc-grey-400 mb-6 flex items-center gap-2">
              <Link href="/" className="hover:text-tbc-black transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/shop" className="hover:text-tbc-black transition-colors">
                Shop
              </Link>
              <span>/</span>
              <span className="text-tbc-black">{label}</span>
            </nav>
            <h1 className="display-heading text-display-sm md:text-display-md">{label}</h1>
            <p className="text-tbc-grey-500 text-sm mt-2">{products.length} products</p>
          </motion.div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="px-5 md:px-8 lg:px-12 pb-16 md:pb-24">
        <div className="max-w-7xl mx-auto">
          {products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-tbc-grey-400 mb-4">
                No products found in this category yet.
              </p>
              <Link href="/shop" className="btn-secondary">
                Browse All Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              {products.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
