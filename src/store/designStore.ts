import { create } from "zustand";
import type { DesignPlacement, GarmentType } from "@/lib/types";

interface DesignState {
  garmentType: GarmentType;
  color: string;
  size: string;
  placements: DesignPlacement[];
  activeZone: DesignPlacement["zone"];
  uploadedImage: string | null;

  setGarmentType: (type: GarmentType) => void;
  setColor: (color: string) => void;
  setSize: (size: string) => void;
  setActiveZone: (zone: DesignPlacement["zone"]) => void;
  setUploadedImage: (url: string | null) => void;
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

export const useDesignStore = create<DesignState>()((set, get) => ({
  garmentType: "t-shirts",
  color: "#0A0A0A",
  size: "M",
  placements: [],
  activeZone: "front-center",
  uploadedImage: null,

  setGarmentType: (type) => set({ garmentType: type }),
  setColor: (color) => set({ color }),
  setSize: (size) => set({ size }),
  setActiveZone: (zone) => set({ activeZone: zone }),
  setUploadedImage: (url) => set({ uploadedImage: url }),

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
      uploadedImage: null,
      activeZone: "front-center",
    }),

  getConfig: () => {
    const { garmentType, color, size, placements } = get();
    return { garmentType, color, size, placements };
  },
}));
