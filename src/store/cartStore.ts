import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, CartGraphic } from "@/lib/types";

const FIVE_DAYS_MS = 5 * 24 * 60 * 60 * 1000;

interface CartState {
  items: CartItem[];
  createdAt: number;
  isOpen: boolean;

  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, "id" | "lineTotal" | "totalPrintCost">) => void;
  removeItem: (id: string) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  subtotal: () => number;
  totalPrintCost: () => number;
  grandTotal: () => number;
}

function calcPrintCost(graphics: CartGraphic[]): number {
  return graphics.reduce((sum, g) => sum + g.printCost, 0);
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      createdAt: Date.now(),
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      addItem: (item) =>
        set((state) => {
          const printCost = calcPrintCost(item.graphics);
          const newItem: CartItem = {
            ...item,
            id: crypto.randomUUID(),
            totalPrintCost: printCost,
            lineTotal: (item.basePrice + printCost) * item.quantity,
          };
          return { items: [...state.items, newItem], createdAt: Date.now(), isOpen: true }; // Auto-open on add
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      updateItemQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id
              ? {
                  ...i,
                  quantity,
                  lineTotal: (i.basePrice + i.totalPrintCost) * quantity,
                }
              : i
          ),
        })),

      clearCart: () => set({ items: [], createdAt: Date.now() }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotal: () => get().items.reduce((sum, i) => sum + i.basePrice * i.quantity, 0),

      totalPrintCost: () =>
        get().items.reduce((sum, i) => sum + i.totalPrintCost * i.quantity, 0),

      grandTotal: () => get().items.reduce((sum, i) => sum + i.lineTotal, 0),
    }),
    {
      name: "tbc-cart",
      partialize: (state) => ({ items: state.items, createdAt: state.createdAt }), // Don't persist isOpen
      onRehydrateStorage: () => (state) => {
        if (state && Date.now() - state.createdAt > FIVE_DAYS_MS) {
          state.clearCart();
        }
      },
    }
  )
);
