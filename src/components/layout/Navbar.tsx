"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { MobileNav } from "./MobileNav";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartCount = mounted ? totalItems() : 0;

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-100 flex justify-between items-center"
        style={{
          mixBlendMode: "difference",
          color: "#fff",
          padding: "22px 32px",
        }}
      >
        {/* Left — Menu + Search */}
        <div className="flex items-center gap-7">
          <button
            onClick={() => setMenuOpen(true)}
            className="bg-transparent border-none text-inherit cursor-pointer"
            style={{ fontFamily: "var(--font-inter), sans-serif", fontWeight: 500, fontSize: "14px" }}
            aria-label="Open menu"
            id="nav-menu-btn"
          >
            ☰ Menu
          </button>
          <button
            className="hidden md:block bg-transparent border-none text-inherit cursor-pointer"
            style={{ fontFamily: "var(--font-inter), sans-serif", fontWeight: 400, fontSize: "14px" }}
          >
            Search
          </button>
        </div>

        {/* Center — Actual TBC Logo */}
        <Link href="/" className="no-underline">
          <Image
            src="/logo/tbc-logo-transparent.png"
            alt="Tbc"
            width={60}
            height={34}
            style={{ objectFit: "contain" }}
            priority
          />
        </Link>

        {/* Right — Help + Log In + Bag */}
        <div className="flex items-center gap-7">
          <Link
            href="/help"
            className="hidden md:block text-inherit no-underline"
            style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "14px" }}
          >
            Help
          </Link>
          <Link
            href="/account"
            className="hidden md:block text-inherit no-underline"
            style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "14px" }}
          >
            Log In
          </Link>
          <button
            onClick={() => useCartStore.getState().openCart()}
            className="flex items-center gap-1.5 bg-transparent border-none text-inherit cursor-pointer p-0"
            style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "14px" }}
            id="nav-cart"
          >
            Bag{" "}
            <span
              className="inline-flex items-center justify-center"
              style={{ width: "18px", height: "18px", border: "1px solid currentColor", fontSize: "10px" }}
            >
              {cartCount}
            </span>
          </button>
        </div>
      </nav>

      <MobileNav isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
