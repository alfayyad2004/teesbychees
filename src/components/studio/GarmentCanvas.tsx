"use client";

import { useRef, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Decal,
  useTexture,
  Center,
} from "@react-three/drei";
import * as THREE from "three";
import { useDesignStore } from "@/store/designStore";

/* ═══════════════════════════════════════════════════
   VIRTUAL THREADS-STYLE T-SHIRT
   Smooth, organic fabric with liquid sheen
   ═══════════════════════════════════════════════════ */

function TShirtModel() {
  const meshRef = useRef<THREE.Mesh>(null);
  const color = useDesignStore((s) => s.color);
  const placements = useDesignStore((s) => s.placements);

  /* ─── Refined T-Shirt Geometry ─── */
  const geometry = useMemo(() => {
    // Create a smooth, organic t-shirt shape
    const shape = new THREE.Shape();

    // More refined silhouette with curved edges
    const w = 1.6;   // half body width
    const h = 2.6;   // body height
    const nw = 0.3;  // neck half-width
    const nd = 0.2;  // neck depth
    const sw = 0.55; // sleeve extension
    const sd = 0.35; // sleeve drop

    // Start bottom-left, go clockwise
    shape.moveTo(-w, -h / 2);

    // Left side (slight waist taper)
    shape.quadraticCurveTo(-w - 0.05, 0, -w, h / 2 - sw);

    // Left sleeve
    shape.lineTo(-w - sw + 0.05, h / 2 - 0.05);
    shape.quadraticCurveTo(-w - sw, h / 2, -w - sw + 0.1, h / 2 + 0.05);
    shape.lineTo(-w + 0.15, h / 2 + sd);

    // Left shoulder curve
    shape.quadraticCurveTo(-w + 0.3, h / 2 + sd + 0.08, -nw - 0.1, h / 2 + sd + 0.05);

    // Neck - smooth scoop
    shape.quadraticCurveTo(0, h / 2 + sd + nd, nw + 0.1, h / 2 + sd + 0.05);

    // Right shoulder
    shape.quadraticCurveTo(w - 0.3, h / 2 + sd + 0.08, w - 0.15, h / 2 + sd);

    // Right sleeve
    shape.lineTo(w + sw - 0.1, h / 2 + 0.05);
    shape.quadraticCurveTo(w + sw, h / 2, w + sw - 0.05, h / 2 - 0.05);
    shape.lineTo(w, h / 2 - sw);

    // Right side
    shape.quadraticCurveTo(w + 0.05, 0, w, -h / 2);

    // Bottom hem
    shape.quadraticCurveTo(0, -h / 2 - 0.06, -w, -h / 2);

    const extrudeSettings = {
      depth: 0.12,
      bevelEnabled: true,
      bevelSize: 0.03,
      bevelThickness: 0.02,
      bevelSegments: 6,
      curveSegments: 32,
    };

    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geo.center();

    // Smooth normals for fabric-like appearance
    geo.computeVertexNormals();

    return geo;
  }, []);

  /* ─── Auto-rotate (Virtual Threads signature gentle spin) ─── */
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <Center>
      <group position={[0, -0.2, 0]} scale={1.15}>
        <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
          {/* Virtual Threads-style fabric material */}
          <meshPhysicalMaterial
            color={color}
            roughness={0.85}
            metalness={0.0}
            /* Fabric sheen — the key to Virtual Threads look */
            sheen={1.0}
            sheenRoughness={0.35}
            sheenColor={new THREE.Color(color).lerp(new THREE.Color("#ffffff"), 0.6)}
            /* Subtle clearcoat for fabric surface sheen */
            clearcoat={0.08}
            clearcoatRoughness={0.6}
            /* Side rendering for proper 3D */
            side={THREE.DoubleSide}
            envMapIntensity={0.8}
          />
          {/* Render placed decals */}
          {placements.map((placement) => (
            <DecalGraphic key={placement.zone} placement={placement} />
          ))}
        </mesh>
      </group>
    </Center>
  );
}

/* ─── Decal Graphic Component ─── */
function DecalGraphic({
  placement,
}: {
  placement: {
    zone: string;
    textureUrl: string;
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number];
  };
}) {
  const texture = useTexture(placement.textureUrl);

  return (
    <Decal
      position={placement.position}
      rotation={placement.rotation}
      scale={[placement.scale[0], placement.scale[1], 1]}
      map={texture}
      depthTest={true}
    />
  );
}

/* ─── Studio Environment ─── */
function StudioLighting() {
  return (
    <>
      {/* Ambient fill */}
      <ambientLight intensity={0.4} />

      {/* Key light — warm, main illumination */}
      <directionalLight
        position={[3, 4, 5]}
        intensity={0.9}
        castShadow
        shadow-mapSize={[1024, 1024]}
        color="#fff5e6"
      />

      {/* Rim light — cool blue tint for depth (Virtual Threads liquid look) */}
      <directionalLight
        position={[-4, 2, -3]}
        intensity={0.35}
        color="#88aaff"
      />

      {/* Fill from below — subtle */}
      <directionalLight
        position={[0, -2, 4]}
        intensity={0.15}
        color="#ffffff"
      />

      {/* HDRI Environment for reflections */}
      <Environment preset="studio" />
    </>
  );
}

/* ─── Main Canvas Export ─── */
export function GarmentCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0.5, 5.5], fov: 40 }}
      gl={{
        antialias: true,
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
      }}
      dpr={[1, 2]}
      style={{ background: "linear-gradient(180deg, #1a1a1a, #0f0f0f)" }}
    >
      {/* Lighting */}
      <StudioLighting />

      {/* T-Shirt Model */}
      <TShirtModel />

      {/* Ground Shadow — soft contact */}
      <ContactShadows
        position={[0, -1.5, 0]}
        opacity={0.25}
        scale={6}
        blur={3}
        far={4}
        color="#000000"
      />

      {/* Orbit Controls — damped, constrained */}
      <OrbitControls
        enablePan={false}
        minDistance={2.5}
        maxDistance={7}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 1.5}
        enableDamping
        dampingFactor={0.03}
        rotateSpeed={0.5}
        autoRotate={false}
      />
    </Canvas>
  );
}
