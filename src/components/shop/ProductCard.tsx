"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images[0] || "/products/tee-white-front.jpg";
  const hoverImage = product.images[1] || primaryImage;

  return (
    <Link
      href={`/shop/${product.category}/${product.slug}`}
      className="group block no-underline"
      id={`product-card-${product.slug}`}
    >
      <div className="relative overflow-hidden bg-tbc-soft aspect-[3/4] mb-3">
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          className="object-cover transition-opacity duration-700 group-hover:opacity-0"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <Image
          src={hoverImage}
          alt={`${product.name} alternate`}
          fill
          className="object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>

      {/* Info */}
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="text-[13px] text-tbc-black tracking-[0.05em] group-hover:opacity-60 transition-opacity">
            {product.name}
          </h3>
        </div>
        <span
          className="text-[15px] tracking-[-0.02em] shrink-0"
          style={{ fontFamily: "'Bodoni Moda', serif", fontWeight: 400 }}
        >
          ${product.base_price_ttd}
        </span>
      </div>
    </Link>
  );
}
