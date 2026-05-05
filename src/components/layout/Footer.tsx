"use client";

import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-tbc-black text-white" style={{ padding: "80px 32px 32px" }}>
      {/* Top Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 pb-16 border-b border-tbc-grey-700">
        {/* Brand with Logo */}
        <div>
          {/* TBC Script Logo */}
          <div className="mb-6">
            <Image
              src="/logo/tbc-logo-transparent.png"
              alt="Tbc"
              width={140}
              height={80}
              style={{ objectFit: "contain", width: "auto", height: "auto" }}
            />
          </div>
          <h4
            className="text-[40px] md:text-[56px] tracking-[-0.02em] leading-[0.9]"
            style={{ fontFamily: "var(--font-bodoni), serif", fontStyle: "italic", fontWeight: 400 }}
          >
            Wear yours.<br />Every day.
          </h4>
          <p
            className="text-[13px] text-tbc-grey-300 mt-6 leading-[1.6] max-w-[360px]"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            Teesbychees — custom graphics, printed in Trinidad. Established 2023.
          </p>
        </div>

        {/* Visit */}
        <div>
          <h5 className="mono text-tbc-grey-500 mb-5">Visit</h5>
          <div className="text-[13px] text-tbc-grey-300 leading-[1.8]" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
            <p>#220 Southern Main Road</p>
            <p>Marabella, San Fernando</p>
            <p>Trinidad &amp; Tobago</p>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h5 className="mono text-tbc-grey-500 mb-5">Contact</h5>
          <div className="space-y-0" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
            <a href="tel:+18683694700" className="block text-[13px] text-tbc-grey-300 leading-[1.8] no-underline hover:text-white transition-colors">
              1 (868) 369-4700
            </a>
            <a href="tel:+18686586544" className="block text-[13px] text-tbc-grey-300 leading-[1.8] no-underline hover:text-white transition-colors">
              1 (868) 658-6544
            </a>
            <a href="mailto:teeschees17@gmail.com" className="block text-[13px] text-tbc-grey-300 leading-[1.8] no-underline hover:text-white transition-colors">
              teeschees17@gmail.com
            </a>
          </div>
        </div>

        {/* Shop */}
        <div>
          <h5 className="mono text-tbc-grey-500 mb-5">Shop</h5>
          <div className="space-y-0" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
            {[
              { name: "Tees", href: "/shop/t-shirts" },
              { name: "Hoodies", href: "/shop/hoodies" },
              { name: "Long Sleeve", href: "/shop/long-sleeves" },
              { name: "Jerseys", href: "/shop/jerseys" },
              { name: "Polos", href: "/shop/polos" },
              { name: "3D Studio", href: "/studio" },
            ].map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block text-[13px] text-tbc-grey-300 leading-[1.8] no-underline hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="text-[11px] text-tbc-grey-500 tracking-[0.15em] uppercase text-center md:text-left" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
          © 2026 Teesbychees · Est. 2023
        </span>
        <span className="text-[11px] text-tbc-grey-500 tracking-[0.15em] uppercase text-center" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
          Wear Yours ✦ Wear Yours ✦ Wear Yours
        </span>
        <a 
          href="https://caribbeancodestudios.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[11px] text-tbc-grey-500 tracking-[0.15em] uppercase hover:text-white transition-colors text-center md:text-right" 
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
        >
          Developed by caribbeancodestudios.com
        </a>
      </div>
    </footer>
  );
}
