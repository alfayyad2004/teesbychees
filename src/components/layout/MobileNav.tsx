"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const categories = [
  { name: "Tees", href: "/shop/t-shirts", num: "01" },
  { name: "Hoodies", href: "/shop/hoodies", num: "02" },
  { name: "Long Sleeve", href: "/shop/long-sleeves", num: "03" },
  { name: "Jerseys", href: "/shop/jerseys", num: "04" },
  { name: "Polos", href: "/shop/polos", num: "05" },
];

const links = [
  { name: "Design Studio", href: "/studio", highlight: true },
  { name: "Pricing Calculator", href: "/calculator" },
  { name: "Lookbook", href: "/lookbook" },
  { name: "Help & FAQ", href: "/help" },
  { name: "Account", href: "/account" },
];

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-200 bg-black/30"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed top-0 left-0 bottom-0 z-300 w-full max-w-[440px] bg-tbc-white overflow-y-auto"
          >
            <div className="p-8 md:p-12 min-h-full flex flex-col">
              {/* Close */}
              <div className="flex justify-between items-center mb-12">
                <span className="mono text-tbc-mute">Shop by Category</span>
                <button
                  onClick={onClose}
                  className="p-2"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Categories */}
              <div className="space-y-1 mb-12">
                {categories.map((cat, i) => (
                  <motion.div
                    key={cat.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Link
                      href={cat.href}
                      onClick={onClose}
                      className="flex items-center justify-between py-4 border-b border-tbc-grey-100 group no-underline text-tbc-black"
                    >
                      <span
                        className="text-[2.5rem] md:text-[3rem] tracking-[-0.03em] leading-none group-hover:opacity-60 transition-opacity"
                        style={{ fontFamily: "'Bodoni Moda', serif", fontStyle: "italic", fontWeight: 400 }}
                      >
                        {cat.name}
                      </span>
                      <span className="mono text-tbc-mute">
                        {cat.num} →
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Divider */}
              <div className="w-12 h-px bg-tbc-line mb-8" />

              {/* Links */}
              <div className="space-y-4 mb-auto">
                {links.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.04 }}
                  >
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className={`flex items-center gap-2 text-sm tracking-[0.15em] uppercase no-underline transition-colors ${
                        link.highlight
                          ? "text-tbc-black font-medium"
                          : "text-tbc-mute hover:text-tbc-black"
                      }`}
                    >
                      {link.highlight && (
                        <span className="w-1.5 h-1.5 bg-tbc-black rounded-full" />
                      )}
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Bottom */}
              <div className="mt-12 pt-8 border-t border-tbc-grey-100">
                <p
                  className="text-3xl tracking-[-0.02em]"
                  style={{ fontFamily: "'Bodoni Moda', serif", fontStyle: "italic", fontWeight: 400 }}
                >
                  Wear yours.
                </p>
                <p className="mono text-tbc-mute mt-4">Est. 2023 · Trinidad</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
