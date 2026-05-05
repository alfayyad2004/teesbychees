"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { X, Minus, Plus, ArrowRight, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export function CartDrawer() {
  const { 
    isOpen, 
    closeCart, 
    items, 
    removeItem, 
    updateItemQuantity, 
    subtotal, 
    totalPrintCost, 
    grandTotal 
  } = useCartStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent background scrolling when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-[420px] bg-[#f4f3f1] z-[101] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 md:p-6 border-b border-tbc-grey-200 bg-white">
              <h2 className="font-display text-xl">Shopping Bag</h2>
              <button 
                onClick={closeCart}
                className="p-2 text-tbc-grey-500 hover:text-tbc-black transition-colors rounded-full hover:bg-tbc-grey-50"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12">
                  <ShoppingBag size={48} className="text-tbc-grey-300 mb-4" />
                  <p className="font-display text-lg mb-2">Your bag is empty.</p>
                  <p className="text-tbc-grey-500 text-sm mb-6">Explore our collections or design your own.</p>
                  <Link href="/shop" onClick={closeCart} className="btn-primary w-full max-w-[200px]">
                    Shop Now
                  </Link>
                </div>
              ) : (
                <div className="p-5 md:p-6 space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 pb-6 border-b border-tbc-grey-200 last:border-0 last:pb-0">
                      {/* Image */}
                      <div className="relative w-20 md:w-24 aspect-[3/4] bg-tbc-grey-100 flex-shrink-0 border border-black/5">
                        <Image
                          src={item.productImage}
                          alt={item.productName}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0 flex flex-col">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="text-sm font-medium leading-tight">{item.productName}</h3>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1 text-tbc-grey-400 hover:text-tbc-black transition-colors"
                            aria-label="Remove item"
                          >
                            <X size={14} />
                          </button>
                        </div>
                        
                        <p className="text-xs text-tbc-grey-500 mt-1">
                          Size: {item.size} · Color:{" "}
                          <span
                            className="inline-block w-2.5 h-2.5 rounded-full border border-tbc-grey-200 align-middle ml-1"
                            style={{ backgroundColor: item.color }}
                          />
                        </p>

                        <div className="mt-2 text-[11px] text-tbc-grey-500 space-y-1">
                          <div className="flex justify-between">
                            <span>Base</span>
                            <span>${item.basePrice.toFixed(2)}</span>
                          </div>
                          {item.graphics.map((g, idx) => (
                            <div key={idx} className="flex justify-between">
                              <span className="truncate pr-2">Print ({g.zone})</span>
                              <span>${g.printCost.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>

                        <div className="mt-auto pt-3 flex items-center justify-between">
                          <div className="inline-flex items-center border border-tbc-grey-200 bg-white">
                            <button
                              onClick={() => updateItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="p-1.5 hover:bg-tbc-grey-50 transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="px-3 text-xs font-medium min-w-[28px] text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                              className="p-1.5 hover:bg-tbc-grey-50 transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <span className="text-sm font-medium">
                            TTD ${item.lineTotal.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="bg-white border-t border-tbc-grey-200 p-5 md:p-6 pb-8 md:pb-6 shadow-[0_-10px_20px_rgba(0,0,0,0.03)]">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-tbc-grey-500">Subtotal</span>
                    <span>TTD ${subtotal().toFixed(2)}</span>
                  </div>
                  {totalPrintCost() > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-tbc-grey-500">Print Costs</span>
                      <span>TTD ${totalPrintCost().toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm border-t border-tbc-grey-100 pt-2 mt-2">
                    <span className="font-medium uppercase tracking-widest text-xs">Total</span>
                    <span className="font-display font-semibold text-lg">TTD ${grandTotal().toFixed(2)}</span>
                  </div>
                </div>

                <Link 
                  href="/checkout" 
                  onClick={closeCart}
                  className="w-full flex items-center justify-center gap-2 bg-tbc-black text-white hover:bg-black/90 py-4 text-sm font-medium tracking-widest uppercase transition-colors"
                >
                  Checkout <ArrowRight size={16} />
                </Link>
                <p className="text-center text-[10px] text-tbc-grey-400 mt-4">
                  Shipping & taxes calculated at checkout
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
