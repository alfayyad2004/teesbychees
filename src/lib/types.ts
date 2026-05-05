export interface Product {
  id: string;
  slug: string;
  name: string;
  category: "hoodies" | "long-sleeves" | "jerseys" | "polos" | "t-shirts";
  base_price_ttd: number;
  description: string;
  images: string[];
  sizes: string[];
  colors: string[];
  created_at?: string;
}

export interface GraphicItem {
  id: string;
  name: string;
  image_url: string;
  tags: string[];
  featured: boolean;
}

export interface CartGraphic {
  zone: "front-center" | "left-chest" | "back" | "left-sleeve" | "right-sleeve";
  imageUrl: string;
  lengthInches: number;
  printCost: number;
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  size: string;
  color: string;
  basePrice: number;
  graphics: CartGraphic[];
  totalPrintCost: number;
  lineTotal: number;
  quantity: number;
}

export interface DesignPlacement {
  zone: "front-center" | "left-chest" | "back" | "left-sleeve" | "right-sleeve";
  textureUrl: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number];
  lengthInches: number;
}

export interface DesignConfig {
  productId: string;
  garmentType: string;
  color: string;
  size: string;
  placements: DesignPlacement[];
}

export type GarmentType = "t-shirts" | "hoodies" | "long-sleeves" | "jerseys" | "polos";

export const GARMENT_TYPES: { value: GarmentType; label: string }[] = [
  { value: "t-shirts", label: "T-Shirts" },
  { value: "hoodies", label: "Hoodies" },
  { value: "long-sleeves", label: "Long Sleeves" },
  { value: "jerseys", label: "Jerseys" },
  { value: "polos", label: "Polos" },
];

export const GARMENT_COLORS = [
  { name: "Black", value: "#0A0A0A" },
  { name: "White", value: "#FAFAFA" },
  { name: "Grey", value: "#6B7280" },
];

export const SIZES = ["S", "M", "L", "XL", "XXL"];

export const PRINT_RATE_PER_INCH = 7.5; // TTD $7.50 per inch

export const PLACEMENT_ZONES = [
  { value: "front-center" as const, label: "Front Center" },
  { value: "left-chest" as const, label: "Left Chest" },
  { value: "back" as const, label: "Back" },
  { value: "left-sleeve" as const, label: "Left Sleeve" },
  { value: "right-sleeve" as const, label: "Right Sleeve" },
];
