import { create } from "zustand";
import type { DesignPlacement, GarmentType } from "@/lib/types";

export interface GraphicLayer {
  id: string;
  imageUrl: string;
  x: number;     // -1 to 1, maps to ±0.1 local space
  y: number;     // -1 to 1, maps to center ±0.3 local space
  scale: number; // 0.1 to 3.0, maps to ×0.15 local space
}

interface DesignState {
  garmentType: GarmentType;
  color: string;
  size: string;
  placements: DesignPlacement[];
  activeZone: DesignPlacement["zone"];
  graphics: GraphicLayer[];
  activeGraphicId: string | null;
  autoRotate: boolean;
  windEnabled: boolean;

  setGarmentType: (type: GarmentType) => void;
  setColor: (color: string) => void;
  setSize: (size: string) => void;
  setActiveZone: (zone: DesignPlacement["zone"]) => void;
  addGraphic: (imageUrl: string) => void;
  updateGraphic: (id: string, updates: Partial<Omit<GraphicLayer, "id" | "imageUrl">>) => void;
  removeGraphic: (id: string) => void;
  setActiveGraphic: (id: string | null) => void;
  setAutoRotate: (rotate: boolean) => void;
  setWindEnabled: (wind: boolean) => void;

  addPlacement: (placement: DesignPlacement) => void;
  updatePlacement: (zone: DesignPlacement["zone"], updates: Partial<DesignPlacement>) => void;
  removePlacement: (zone: DesignPlacement["zone"]) => void;
  clearDesign: () => void;
  getConfig: () => {
    garmentType: GarmentType;
    color: string;
    size: string;
    placements: DesignPlacement[];
  };
}

let nextId = 1;

export const useDesignStore = create<DesignState>()((set, get) => ({
  garmentType: "t-shirts",
  color: "#0A0A0A",
  size: "M",
  placements: [],
  activeZone: "front-center",
  graphics: [],
  activeGraphicId: null,
  autoRotate: true,
  windEnabled: true,

  setGarmentType: (type) => set({ garmentType: type }),
  setColor: (color) => set({ color }),
  setSize: (size) => set({ size }),
  setActiveZone: (zone) => set({ activeZone: zone }),

  addGraphic: (imageUrl) => {
    const id = `graphic-${nextId++}`;
    set((state) => ({
      graphics: [...state.graphics, { id, imageUrl, x: 0, y: 0, scale: 1.0 }],
      activeGraphicId: id,
    }));
  },

  updateGraphic: (id, updates) =>
    set((state) => ({
      graphics: state.graphics.map((g) => (g.id === id ? { ...g, ...updates } : g)),
    })),

  removeGraphic: (id) =>
    set((state) => ({
      graphics: state.graphics.filter((g) => g.id !== id),
      activeGraphicId: state.activeGraphicId === id
        ? (state.graphics.find((g) => g.id !== id)?.id ?? null)
        : state.activeGraphicId,
    })),

  setActiveGraphic: (id) => set({ activeGraphicId: id }),

  setAutoRotate: (rotate) => set({ autoRotate: rotate }),
  setWindEnabled: (wind) => set({ windEnabled: wind }),

  addPlacement: (placement) =>
    set((state) => ({
      placements: [
        ...state.placements.filter((p) => p.zone !== placement.zone),
        placement,
      ],
    })),

  updatePlacement: (zone, updates) =>
    set((state) => ({
      placements: state.placements.map((p) =>
        p.zone === zone ? { ...p, ...updates } : p
      ),
    })),

  removePlacement: (zone) =>
    set((state) => ({
      placements: state.placements.filter((p) => p.zone !== zone),
    })),

  clearDesign: () =>
    set({
      placements: [],
      graphics: [],
      activeGraphicId: null,
      activeZone: "front-center",
    }),

  getConfig: () => {
    const { garmentType, color, size, placements } = get();
    return { garmentType, color, size, placements };
  },
}));
