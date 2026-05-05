"use client";

import { useCallback } from "react";
import { Upload, RotateCcw, Hexagon, Trash2, Plus, MousePointer2 } from "lucide-react";
import { useDesignStore } from "@/store/designStore";
import { GARMENT_COLORS } from "@/lib/types";

export function ControlsPanel() {
  const {
    color,
    graphics,
    activeGraphicId,
    setColor,
    addGraphic,
    updateGraphic,
    removeGraphic,
    setActiveGraphic,
    clearDesign,
  } = useDesignStore();

  const activeGraphic = graphics.find((g) => g.id === activeGraphicId) ?? null;

  const handleFileUpload = useCallback(
    (file: File) => {
      const validTypes = ["image/png", "image/jpeg", "image/svg+xml"];
      if (!validTypes.includes(file.type)) {
        alert("Please upload a PNG, JPG, or SVG file.");
        return;
      }
      const url = URL.createObjectURL(file);
      addGraphic(url);
    },
    [addGraphic]
  );

  const handleRemove = useCallback(
    (id: string, imageUrl: string) => {
      URL.revokeObjectURL(imageUrl);
      removeGraphic(id);
    },
    [removeGraphic]
  );

  return (
    <div className="p-5 md:p-6 space-y-8 bg-[#0e0e16] text-white min-h-full">

      {/* ── Color ── */}
      <div>
        <label className="text-xs uppercase tracking-[0.12em] text-white/50 mb-3 block">
          Base Color
        </label>
        {/* swatches: w-11 h-11 (44 px) meets the mobile touch-target minimum */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {GARMENT_COLORS.map((c) => (
            <button
              key={c.value}
              onClick={() => setColor(c.value)}
              className={`w-11 h-11 rounded-full border-2 transition-all ${
                color === c.value ? "border-white scale-110" : "border-white/10"
              }`}
              style={{ backgroundColor: c.value }}
              title={c.name}
            />
          ))}
        </div>
        <div className="flex items-center gap-2 bg-white/5 rounded p-2 border border-white/10">
          <Hexagon size={14} className="text-white/50" />
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-7 h-7 rounded cursor-pointer border-0 p-0 bg-transparent"
          />
          <input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="bg-transparent border-none text-xs text-white/80 focus:outline-none uppercase w-full font-mono"
            placeholder="#000000"
          />
        </div>
      </div>

      {/* ── Graphic Layers ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs uppercase tracking-[0.12em] text-white/50">
            Graphics {graphics.length > 0 && `(${graphics.length})`}
          </label>
          {/* "Add" label: py-2 gives ≥44 px touch height */}
          <label className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white cursor-pointer transition-colors py-2 px-1 -mr-1">
            <Plus size={13} />
            Add
            <input
              type="file"
              accept=".png,.jpg,.jpeg,.svg"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
                e.target.value = "";
              }}
            />
          </label>
        </div>

        {graphics.length === 0 ? (
          <label className="block border-2 border-dashed rounded-lg p-6 text-center cursor-pointer border-white/20 hover:border-white/40 transition-colors active:border-white/60">
            <Upload size={24} className="mx-auto mb-2 text-white/40" />
            <p className="text-xs text-white/60">
              Drop your graphic or <span className="underline">browse</span>
            </p>
            <p className="text-[10px] text-white/40 mt-1">PNG, JPG, SVG</p>
            <input
              type="file"
              accept=".png,.jpg,.jpeg,.svg"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
                e.target.value = "";
              }}
            />
          </label>
        ) : (
          <div className="space-y-2">
            {graphics.map((g, idx) => (
              <div
                key={g.id}
                onClick={() => setActiveGraphic(g.id === activeGraphicId ? null : g.id)}
                className={`flex items-center gap-3 px-2 py-3 rounded border cursor-pointer transition-all min-h-[52px] ${
                  g.id === activeGraphicId
                    ? "border-white/40 bg-white/10"
                    : "border-white/10 bg-white/5 hover:border-white/25 active:bg-white/10"
                }`}
              >
                <img
                  src={g.imageUrl}
                  alt={`Graphic ${idx + 1}`}
                  className="w-10 h-10 object-contain bg-white/10 rounded flex-shrink-0"
                />
                <span className="text-xs text-white/70 flex-1 truncate">
                  Graphic {idx + 1}
                </span>
                {g.id === activeGraphicId && (
                  <span className="text-[10px] text-white/50 flex items-center gap-1 flex-shrink-0">
                    <MousePointer2 size={10} /> drag
                  </span>
                )}
                {/* Trash: -m-1 p-2 expands the touch area without changing visual layout */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(g.id, g.imageUrl);
                  }}
                  className="text-red-400/70 hover:text-red-300 active:text-red-200 transition-colors flex-shrink-0 p-2 -m-1 rounded"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Controls for active graphic ── */}
      {activeGraphic && (
        <div className="space-y-5">
          <p className="text-[10px] uppercase tracking-widest text-white/40">
            Selected — tap &amp; drag on shirt to reposition
          </p>

          {/* Scale slider */}
          <div>
            <label className="text-xs uppercase tracking-[0.12em] text-white/50 mb-2 flex justify-between">
              <span>Scale</span>
              <span className="text-white/80">{activeGraphic.scale.toFixed(1)}×</span>
            </label>
            <input
              type="range"
              min="0.1"
              max="3.0"
              step="0.05"
              value={activeGraphic.scale}
              onChange={(e) =>
                updateGraphic(activeGraphic.id, { scale: parseFloat(e.target.value) })
              }
              className="w-full accent-white h-11 cursor-pointer"
            />
          </div>

          {/* Vertical slider */}
          <div>
            <label className="text-xs uppercase tracking-[0.12em] text-white/50 mb-2 flex justify-between">
              <span>Vertical</span>
              <span className="text-white/80">{activeGraphic.y.toFixed(2)}</span>
            </label>
            <input
              type="range"
              min="-1"
              max="1"
              step="0.02"
              value={activeGraphic.y}
              onChange={(e) =>
                updateGraphic(activeGraphic.id, { y: parseFloat(e.target.value) })
              }
              className="w-full accent-white h-11 cursor-pointer"
            />
          </div>

          {/* Horizontal slider */}
          <div>
            <label className="text-xs uppercase tracking-[0.12em] text-white/50 mb-2 flex justify-between">
              <span>Horizontal</span>
              <span className="text-white/80">{activeGraphic.x.toFixed(2)}</span>
            </label>
            <input
              type="range"
              min="-1"
              max="1"
              step="0.02"
              value={activeGraphic.x}
              onChange={(e) =>
                updateGraphic(activeGraphic.id, { x: parseFloat(e.target.value) })
              }
              className="w-full accent-white h-11 cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* ── Reset ── */}
      <div className="pt-4 border-t border-white/10">
        <button
          onClick={clearDesign}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded text-xs uppercase tracking-widest bg-white/5 hover:bg-white/10 active:bg-white/15 text-white transition-colors"
        >
          <RotateCcw size={14} />
          Reset Defaults
        </button>
      </div>
    </div>
  );
}
