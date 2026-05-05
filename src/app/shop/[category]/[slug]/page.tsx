"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Minus, Plus, Heart } from "lucide-react";
import { getProductBySlug, getCategoryLabel, PRODUCTS } from "@/lib/data";
import { useCartStore } from "@/store/cartStore";
import { ProductCard } from "@/components/shop/ProductCard";

interface PDPProps {
  params: Promise<{ category: string; slug: string }>;
}

export default function ProductDetailPage({ params }: PDPProps) {
  const { category, slug } = use(params);
  const product = getProductBySlug(slug);
  const addItem = useCartStore((s) => s.addItem);

  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || "#0A0A0A");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="pt-32 text-center">
        <h1 className="text-2xl mb-4">Product not found</h1>
        <Link href="/shop" className="btn-secondary">
          Back to Shop
        </Link>
      </div>
    );
  }

  const categoryLabel = getCategoryLabel(category);
  const related = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      productName: product.name,
      productImage: product.images[0] || "/products/tee-white-front.jpg",
      size: selectedSize,
      color: selectedColor,
      basePrice: product.base_price_ttd,
      graphics: [],
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="pt-20 md:pt-24">
      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-12">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-tbc-grey-400 py-6 flex items-center gap-2"
        >
          <Link href="/" className="hover:text-tbc-black transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-tbc-black transition-colors">Shop</Link>
          <span>/</span>
          <Link href={`/shop/${category}`} className="hover:text-tbc-black transition-colors">
            {categoryLabel}
          </Link>
          <span>/</span>
          <span className="text-tbc-black">{product.name}</span>
        </motion.nav>

        {/* Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 pb-16">
          {/* Left — Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Main Image */}
            <div className="relative aspect-[3/4] bg-tbc-grey-50 overflow-hidden mb-3">
              <Image
                src={product.images[activeImage] || "/products/tee-white-front.jpg"}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative w-20 h-24 bg-tbc-grey-50 overflow-hidden transition-opacity ${
                      activeImage === i ? "opacity-100 ring-1 ring-tbc-black" : "opacity-50 hover:opacity-75"
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Right — Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:pt-4"
          >
            <p className="overline mb-3">{categoryLabel}</p>
            <h1 className="font-display text-[2rem] md:text-[2.5rem] tracking-[-0.02em] leading-tight mb-3">
              {product.name}
            </h1>
            <p className="text-xl font-light mb-6">
              TTD ${product.base_price_ttd.toFixed(2)}
            </p>
            <p className="text-tbc-grey-500 text-sm leading-relaxed mb-8 max-w-md">
              {product.description}
            </p>

            {/* Color Selector */}
            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.1em] text-tbc-grey-500 mb-3">
                Color
              </p>
              <div className="flex items-center gap-2.5">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor === color
                        ? "border-tbc-black scale-110"
                        : "border-tbc-grey-200 hover:border-tbc-grey-400"
                    }`}
                    style={{ backgroundColor: color }}
                    aria-label={color}
                  />
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs uppercase tracking-[0.1em] text-tbc-grey-500">Size</p>
                <button className="text-xs text-tbc-grey-400 underline hover:text-tbc-black transition-colors">
                  Size Guide
                </button>
              </div>
              <div className="flex items-center gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 flex items-center justify-center text-sm transition-all ${
                      selectedSize === size
                        ? "bg-tbc-black text-white"
                        : "bg-tbc-grey-50 text-tbc-grey-700 hover:bg-tbc-grey-100"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <p className="text-xs uppercase tracking-[0.1em] text-tbc-grey-500 mb-3">
                Quantity
              </p>
              <div className="inline-flex items-center border border-tbc-grey-200">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-tbc-grey-50 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="px-6 text-sm font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-tbc-grey-50 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                className="btn-primary flex-1"
                id="add-to-cart-btn"
              >
                {added ? "✓ Added" : "Add to Cart"}
              </button>
              <button className="btn-secondary !p-3" aria-label="Add to wishlist">
                <Heart size={18} />
              </button>
            </div>

            {/* Customize CTA */}
            <Link
              href={`/studio?product=${product.slug}`}
              className="block text-center py-3 text-sm tracking-[0.08em] uppercase text-tbc-grey-500 hover:text-tbc-black border border-dashed border-tbc-grey-200 hover:border-tbc-grey-400 transition-all"
            >
              ✦ Customize This with Your Own Graphic
            </Link>

            {/* Fit Notes */}
            <div className="mt-10 pt-8 border-t border-tbc-grey-100">
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer text-sm font-medium py-2">
                  <span>Fit & Details</span>
                  <Plus size={14} className="group-open:hidden" />
                  <Minus size={14} className="hidden group-open:block" />
                </summary>
                <div className="pb-4 text-sm text-tbc-grey-500 leading-relaxed">
                  <ul className="space-y-1.5 mt-2">
                    <li>• Regular / Oversized fit</li>
                    <li>• 100% Premium cotton, 240gsm</li>
                    <li>• Ribbed crew neck</li>
                    <li>• Pre-shrunk</li>
                    <li>• Screen-printed graphic</li>
                    <li>• Machine washable</li>
                  </ul>
                </div>
              </details>
              <details className="group border-t border-tbc-grey-100">
                <summary className="flex items-center justify-between cursor-pointer text-sm font-medium py-2">
                  <span>Shipping</span>
                  <Plus size={14} className="group-open:hidden" />
                  <Minus size={14} className="hidden group-open:block" />
                </summary>
                <div className="pb-4 text-sm text-tbc-grey-500 leading-relaxed mt-2">
                  Local delivery in Trinidad within 3–5 business days. Island-wide shipping available.
                </div>
              </details>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="py-12 md:py-16 border-t border-tbc-grey-100">
            <h2 className="font-display text-2xl md:text-3xl mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
