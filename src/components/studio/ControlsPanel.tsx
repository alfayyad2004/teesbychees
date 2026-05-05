"use client";

import { useState, useCallback } from "react";
import { Upload, RotateCcw, ShoppingBag, Save } from "lucide-react";
import { useDesignStore } from "@/store/designStore";
import { useCartStore } from "@/store/cartStore";
import {
  GARMENT_TYPES,
  GARMENT_COLORS,
  SIZES,
  PLACEMENT_ZONES,
  PRINT_RATE_PER_INCH,
} from "@/lib/types";
import type { DesignPlacement } from "@/lib/types";

// Default positions for each zone on the t-shirt model
const ZONE_DEFAULTS: Record<string, { position: [number, number, number]; scale: [number, number] }> = {
  "front-center": { position: [0, 0.3, 0.65], scale: [1.2, 1.2] },
  "left-chest": { position: [-0.5, 0.8, 0.65], scale: [0.5, 0.5] },
  "back": { position: [0, 0.3, -0.65], scale: [1.2, 1.2] },
  "left-sleeve": { position: [-1.4, 0.6, 0], scale: [0.4, 0.4] },
  "right-sleeve": { position: [1.4, 0.6, 0], scale: [0.4, 0.4] },
};

// Front panel height in inches for a medium tee
const FRONT_PANEL_HEIGHT_INCHES = 20;
// Model front panel height in world units
const MODEL_PANEL_HEIGHT = 2.8;

export function ControlsPanel() {
  const {
    garmentType,
    color,
    size,
    placements,
    activeZone,
    uploadedImage,
    setGarmentType,
    setColor,
    setSize,
    setActiveZone,
    setUploadedImage,
    addPlacement,
    updatePlacement,
    removePlacement,
    clearDesign,
  } = useDesignStore();

  const addItem = useCartStore((s) => s.addItem);
  const [dragOver, setDragOver] = useState(false);
  const [added, setAdded] = useState(false);

  // Current active placement
  const activePlacement = placements.find((p) => p.zone === activeZone);

  // Calculate scale in inches
  const scaleToInches = (scale: number): number => {
    return (scale / MODEL_PANEL_HEIGHT) * FRONT_PANEL_HEIGHT_INCHES;
  };

  const handleFileUpload = useCallback(
    (file: File) => {
      const validTypes = ["image/png", "image/jpeg", "image/svg+xml"];
      if (!validTypes.includes(file.type)) {
        alert("Please upload a PNG, JPG, or SVG file.");
        return;
      }
      const url = URL.createObjectURL(file);
      setUploadedImage(url);

      // Auto-place on active zone
      const defaults = ZONE_DEFAULTS[activeZone] || ZONE_DEFAULTS["front-center"];
      const placement: DesignPlacement = {
        zone: activeZone,
        textureUrl: url,
        position: defaults.position,
        rotation: [0, 0, 0],
        scale: defaults.scale,
        lengthInches: scaleToInches(Math.max(defaults.scale[0], defaults.scale[1])),
      };
      addPlacement(placement);
    },
    [activeZone, addPlacement, setUploadedImage]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFileUpload(file);
    },
    [handleFileUpload]
  );

  const handleScaleChange = (value: number) => {
    if (!activePlacement) return;
    const newScale: [number, number] = [value, value];
    const lengthInches = scaleToInches(value);
    updatePlacement(activeZone, {
      scale: newScale,
      lengthInches,
    });
  };

  const handleAddToCart = () => {
    const graphics = placements.map((p) => ({
      zone: p.zone,
      imageUrl: p.textureUrl,
      lengthInches: p.lengthInches,
      printCost: p.lengthInches * PRINT_RATE_PER_INCH,
    }));

    const garmentLabel = GARMENT_TYPES.find((g) => g.value === garmentType)?.label || "T-Shirt";
    const basePrice = garmentType === "hoodies" ? 350 : garmentType === "long-sleeves" ? 225 : garmentType === "jerseys" ? 275 : garmentType === "polos" ? 200 : 150;

    addItem({
      productId: `custom-${garmentType}`,
      productName: `Custom ${garmentLabel}`,
      productImage: "/products/tee-white-front.jpg",
      size,
      color,
      basePrice,
      graphics,
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="p-5 md:p-6 space-y-6">
      {/* Garment Type */}
      <div>
        <label className="text-xs uppercase tracking-[0.12em] text-tbc-grey-500 mb-3 block">
          Garment
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {GARMENT_TYPES.map((g) => (
            <button
              key={g.value}
              onClick={() => setGarmentType(g.value)}
              className={`py-2 text-xs tracking-[0.05em] text-center transition-all ${
                garmentType === g.value
                  ? "bg-tbc-black text-white"
                  : "bg-tbc-grey-50 text-tbc-grey-600 hover:bg-tbc-grey-100"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <label className="text-xs uppercase tracking-[0.12em] text-tbc-grey-500 mb-3 block">
          Base Color
        </label>
        <div className="flex items-center gap-3">
          {GARMENT_COLORS.map((c) => (
            <button
              key={c.value}
              onClick={() => setColor(c.value)}
              className={`w-9 h-9 rounded-full border-2 transition-all ${
                color === c.value ? "border-tbc-black scale-110" : "border-tbc-grey-200"
              }`}
              style={{ backgroundColor: c.value }}
              title={c.name}
            />
          ))}
        </div>
      </div>

      {/* Size */}
      <div>
        <label className="text-xs uppercase tracking-[0.12em] text-tbc-grey-500 mb-3 block">
          Size
        </label>
        <div className="flex items-center gap-1.5">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={`w-11 h-11 flex items-center justify-center text-xs font-medium transition-all ${
                size === s
                  ? "bg-tbc-black text-white"
                  : "bg-tbc-grey-50 text-tbc-grey-600 hover:bg-tbc-grey-100"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Placement Zone */}
      <div>
        <label className="text-xs uppercase tracking-[0.12em] text-tbc-grey-500 mb-3 block">
          Print Placement
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {PLACEMENT_ZONES.map((zone) => {
            const hasGraphic = placements.some((p) => p.zone === zone.value);
            return (
              <button
                key={zone.value}
                onClick={() => setActiveZone(zone.value)}
                className={`py-2.5 text-xs tracking-[0.05em] text-center transition-all relative ${
                  activeZone === zone.value
                    ? "bg-tbc-black text-white"
                    : "bg-tbc-grey-50 text-tbc-grey-600 hover:bg-tbc-grey-100"
                }`}
              >
                {zone.label}
                {hasGraphic && (
                  <span className="absolute top-1 right-1.5 w-1.5 h-1.5 bg-green-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Upload Zone */}
      <div>
        <label className="text-xs uppercase tracking-[0.12em] text-tbc-grey-500 mb-3 block">
          Upload Graphic
        </label>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer ${
            dragOver
              ? "border-tbc-black bg-tbc-grey-50"
              : "border-tbc-grey-200 hover:border-tbc-grey-400"
          }`}
          onClick={() => document.getElementById("graphic-upload")?.click()}
        >
          <Upload size={24} className="mx-auto mb-2 text-tbc-grey-400" />
          <p className="text-xs text-tbc-grey-500">
            Drop your graphic here or <span className="underline">browse</span>
          </p>
          <p className="text-[10px] text-tbc-grey-400 mt-1">PNG, JPG, SVG</p>
          <input
            id="graphic-upload"
            type="file"
            accept=".png,.jpg,.jpeg,.svg"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
          />
        </div>

        {/* Uploaded preview */}
        {uploadedImage && (
          <div className="mt-3 flex items-center gap-3 p-2 bg-tbc-grey-50 rounded">
            <img
              src={uploadedImage}
              alt="Uploaded graphic"
              className="w-10 h-10 object-contain bg-white rounded"
            />
            <span className="text-xs text-tbc-grey-600 flex-1 truncate">Graphic uploaded</span>
            <button
              onClick={() => {
                setUploadedImage(null);
                removePlacement(activeZone);
              }}
              className="text-xs text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      {/* Scale Control */}
      {activePlacement && (
        <div>
          <label className="text-xs uppercase tracking-[0.12em] text-tbc-grey-500 mb-3 block">
            Graphic Size: {activePlacement.lengthInches.toFixed(1)}&quot;
          </label>
          <input
            type="range"
            min="0.2"
            max="2.5"
            step="0.05"
            value={Math.max(activePlacement.scale[0], activePlacement.scale[1])}
            onChange={(e) => handleScaleChange(parseFloat(e.target.value))}
            className="w-full accent-tbc-black"
          />
          <div className="flex justify-between text-[10px] text-tbc-grey-400 mt-1">
            <span>Small</span>
            <span>Large</span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="pt-2 space-y-2">
        <button onClick={handleAddToCart} className="btn-primary w-full" id="studio-add-to-cart">
          <ShoppingBag size={16} />
          {added ? "✓ Added to Cart" : "Add to Cart"}
        </button>
        <div className="flex gap-2">
          <button className="btn-secondary flex-1 text-xs">
            <Save size={14} />
            Save Design
          </button>
          <button
            onClick={clearDesign}
            className="btn-secondary flex-1 text-xs"
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
