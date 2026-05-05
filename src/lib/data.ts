import type { Product, GraphicItem } from "./types";

export const PRODUCTS: Product[] = [
  // T-Shirts
  {
    id: "prod-001",
    slug: "tom-and-jerry-classic-tee",
    name: "Tom & Jerry Classic Tee",
    category: "t-shirts",
    base_price_ttd: 175,
    description: "Retro Tom & Jerry nostalgia meets TBC signature. Premium cotton, regular fit.",
    images: ["/products/tee-white-front.jpg", "/products/tee-white-back.jpg"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["#FAFAFA", "#0A0A0A"],
  },
  {
    id: "prod-002",
    slug: "slot-machine-tee",
    name: "Slot Machine Tee",
    category: "t-shirts",
    base_price_ttd: 175,
    description: "Hit the jackpot with TBC. Casino-inspired graphic on heavyweight cotton.",
    images: ["/products/tee-black-front.jpg", "/products/tee-black-back.jpg"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["#0A0A0A", "#FAFAFA"],
  },
  {
    id: "prod-003",
    slug: "tennis-club-tee",
    name: "Tennis Club Tee",
    category: "t-shirts",
    base_price_ttd: 175,
    description: "Teesbychees Tennis Club, since 2023. Preppy sport club aesthetic.",
    images: ["/products/tee-white-tennis.jpg"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["#FAFAFA"],
  },
  {
    id: "prod-004",
    slug: "comic-pop-tee",
    name: "Comic Pop Tee",
    category: "t-shirts",
    base_price_ttd: 175,
    description: "KABLAM! Comic-book pop art in true TBC fashion. Oversized fit.",
    images: ["/products/tee-white-comic.jpg"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["#FAFAFA", "#0A0A0A"],
  },
  {
    id: "prod-005",
    slug: "windows-98-tee",
    name: "Windows 98 Tee",
    category: "t-shirts",
    base_price_ttd: 175,
    description: "Y2K nostalgia. Windows 98 desktop meets streetwear. TBC Studio edition.",
    images: ["/products/tee-white-win98.jpg"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["#FAFAFA"],
  },
  {
    id: "prod-006",
    slug: "tbc-studio-tee",
    name: "TBC Studio Tee",
    category: "t-shirts",
    base_price_ttd: 150,
    description: "The essential TBC logo tee. Clean, bold, minimal.",
    images: ["/products/tee-white-studio.jpg"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["#FAFAFA", "#0A0A0A", "#6B7280"],
  },
  // Hoodies
  {
    id: "prod-007",
    slug: "tbc-signature-hoodie",
    name: "TBC Signature Hoodie",
    category: "hoodies",
    base_price_ttd: 350,
    description: "Premium heavyweight hoodie with TBC embroidered logo. Oversized fit, kangaroo pocket.",
    images: ["/products/hoodie-black-front.jpg"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["#0A0A0A", "#FAFAFA", "#6B7280"],
  },
  {
    id: "prod-008",
    slug: "sinner-hoodie",
    name: "Sinner Hoodie",
    category: "hoodies",
    base_price_ttd: 375,
    description: "Religious iconography collection. Bold back print, subtle front logo.",
    images: ["/products/hoodie-black-sinner.jpg"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["#0A0A0A"],
  },
  // Long Sleeves
  {
    id: "prod-009",
    slug: "tbc-vintage-long-sleeve",
    name: "TBC Vintage Long Sleeve",
    category: "long-sleeves",
    base_price_ttd: 225,
    description: "Retro-washed long sleeve with vintage TBC print. Relaxed cut.",
    images: ["/products/ls-white-front.jpg"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["#FAFAFA", "#0A0A0A"],
  },
  // Jerseys
  {
    id: "prod-010",
    slug: "tbc-mesh-jersey",
    name: "TBC Mesh Jersey",
    category: "jerseys",
    base_price_ttd: 275,
    description: "Breathable mesh jersey with full-front graphic. Sport-luxe fit.",
    images: ["/products/jersey-black-front.jpg"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["#0A0A0A", "#FAFAFA"],
  },
  // Polos
  {
    id: "prod-011",
    slug: "tbc-club-polo",
    name: "TBC Club Polo",
    category: "polos",
    base_price_ttd: 200,
    description: "Clean-cut polo with embroidered TBC crest. Cotton piqué.",
    images: ["/products/polo-white-front.jpg"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["#FAFAFA", "#0A0A0A"],
  },
];

export const GRAPHICS: GraphicItem[] = [
  {
    id: "gfx-001",
    name: "Sinner",
    image_url: "/graphics/sinner.jpg",
    tags: ["religious", "iconography", "dark"],
    featured: true,
  },
  {
    id: "gfx-002",
    name: "Tennis Club",
    image_url: "/graphics/tennis-club.jpg",
    tags: ["sport", "preppy", "vintage"],
    featured: true,
  },
  {
    id: "gfx-003",
    name: "Comic Pop",
    image_url: "/graphics/comic-pop.jpg",
    tags: ["comic", "pop-art", "bold"],
    featured: true,
  },
  {
    id: "gfx-004",
    name: "Vintage Denim",
    image_url: "/graphics/vintage-denim.jpg",
    tags: ["vintage", "retro", "classic"],
    featured: false,
  },
  {
    id: "gfx-005",
    name: "Religious Icon",
    image_url: "/graphics/religious-icon.jpg",
    tags: ["religious", "iconography", "statement"],
    featured: false,
  },
  {
    id: "gfx-006",
    name: "Windows 98",
    image_url: "/graphics/windows-98.jpg",
    tags: ["y2k", "nostalgia", "tech"],
    featured: true,
  },
  {
    id: "gfx-007",
    name: "Slot Machine",
    image_url: "/graphics/slot-machine.jpg",
    tags: ["casino", "luck", "bold"],
    featured: true,
  },
  {
    id: "gfx-008",
    name: "Tom & Jerry",
    image_url: "/graphics/tom-jerry.jpg",
    tags: ["cartoon", "nostalgia", "retro"],
    featured: true,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}

export function getFeaturedProducts(): Product[] {
  return PRODUCTS.slice(0, 6);
}

export function getFeaturedGraphics(): GraphicItem[] {
  return GRAPHICS.filter((g) => g.featured);
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    "t-shirts": "T-Shirts",
    hoodies: "Hoodies",
    "long-sleeves": "Long Sleeves",
    jerseys: "Jerseys",
    polos: "Polos",
  };
  return labels[category] || category;
}
