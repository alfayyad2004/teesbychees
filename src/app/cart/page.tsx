"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, X, ArrowRight, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export default function CartPage() {
  const { items, removeItem, updateItemQuantity, grandTotal, subtotal, totalPrintCost } =
    useCartStore();

  if (items.length === 0) {
    return (
      <div className="pt-20 md:pt-24 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center px-6"
        >
          <ShoppingBag size={48} className="mx-auto mb-6 text-tbc-grey-300" />
          <h1 className="font-display text-2xl md:text-3xl mb-3">Your bag is empty</h1>
          <p className="text-tbc-grey-500 text-sm mb-8">
            Discover our collections or create your own design.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/shop" className="btn-primary">
              Shop Now
            </Link>
            <Link href="/studio" className="btn-secondary">
              Design Your Own
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-20 md:pt-24 min-h-screen">
      <div className="max-w-6xl mx-auto px-5 md:px-8 lg:px-12 py-10 md:py-16">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-display-sm mb-8"
        >
          Shopping Bag
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
          {/* Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex gap-4 md:gap-6 pb-6 border-b border-tbc-grey-100"
              >
                {/* Product Image */}
                <div className="relative w-24 md:w-32 aspect-[3/4] bg-tbc-grey-50 flex-shrink-0">
                  <Image
                    src={item.productImage}
                    alt={item.productName}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-medium">{item.productName}</h3>
                      <p className="text-xs text-tbc-grey-500 mt-1">
                        Size: {item.size} · Color:{" "}
                        <span
                          className="inline-block w-3 h-3 rounded-full border border-tbc-grey-200 align-middle"
                          style={{ backgroundColor: item.color }}
                        />
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 text-tbc-grey-400 hover:text-tbc-black transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Price Breakdown */}
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-xs text-tbc-grey-500">
                      <span>Base price</span>
                      <span>TTD ${item.basePrice.toFixed(2)}</span>
                    </div>
                    {item.graphics.length > 0 && (
                      <>
                        {item.graphics.map((g) => (
                          <div
                            key={g.zone}
                            className="flex justify-between text-xs text-tbc-grey-500"
                          >
                            <span>Print: {g.zone} ({g.lengthInches.toFixed(1)}&quot;)</span>
                            <span>TTD ${g.printCost.toFixed(2)}</span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>

                  {/* Quantity + Line Total */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="inline-flex items-center border border-tbc-grey-200">
                      <button
                        onClick={() =>
                          updateItemQuantity(item.id, Math.max(1, item.quantity - 1))
                        }
                        className="p-2 hover:bg-tbc-grey-50 transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="px-4 text-xs font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-tbc-grey-50 transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <span className="text-sm font-medium">
                      TTD ${item.lineTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-tbc-grey-50 p-6">
              <h2 className="text-xs uppercase tracking-[0.12em] text-tbc-grey-500 mb-5">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-tbc-grey-500">Subtotal</span>
                  <span>TTD ${subtotal().toFixed(2)}</span>
                </div>
                {totalPrintCost() > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-tbc-grey-500">Print costs</span>
                    <span>TTD ${totalPrintCost().toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-tbc-grey-500">Shipping</span>
                  <span className="text-tbc-grey-400">Calculated at checkout</span>
                </div>
              </div>

              <div className="border-t-2 border-tbc-black pt-3 mb-6 flex justify-between">
                <span className="text-sm font-medium uppercase tracking-[0.08em]">Total</span>
                <span className="text-lg font-display font-semibold">
                  TTD ${grandTotal().toFixed(2)}
                </span>
              </div>

              <Link href="/checkout" className="btn-primary w-full mb-3">
                Checkout <ArrowRight size={16} />
              </Link>

              <p className="text-[10px] text-tbc-grey-400 text-center">
                Custom designs held for 5 days
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
