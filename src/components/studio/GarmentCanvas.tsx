"use client";

import { useRef, useMemo, useEffect, useState, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Decal,
  useTexture,
  useGLTF,
  Center,
  Bounds,
} from "@react-three/drei";
import * as THREE from "three";
import { useDesignStore, type GraphicLayer } from "@/store/designStore";

useGLTF.preload("/models/tshirt.glb");

// Coordinate mapping constants (GLB local space)
const CHEST_Y = 1.29;      // Y center of front chest panel
const DECAL_Z = 0.16;      // front face Z
const X_SCALE = 0.1;       // slider ±1 → ±0.10 local
const Y_RANGE = 0.3;       // slider ±1 → ±0.30 local from CHEST_Y
const SIZE_SCALE = 0.15;   // scale 1.0 → 0.15 local units

/* ═══════════════════════════════════════════════════
   PER-GRAPHIC DECAL — owns its own texture
   ═══════════════════════════════════════════════════ */
function GraphicDecal({ graphic }: { graphic: GraphicLayer }) {
  const texture = useTexture(graphic.imageUrl);

  useEffect(() => {
    texture.anisotropy = 16;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
  }, [graphic.imageUrl, texture]);

  return (
    <Decal
      position={[graphic.x * X_SCALE, CHEST_Y + graphic.y * Y_RANGE, DECAL_Z]}
      rotation={[0, 0, 0]}
      scale={[graphic.scale * SIZE_SCALE, graphic.scale * SIZE_SCALE, 0.25]}
    >
      <meshPhysicalMaterial
        map={texture}
        polygonOffset
        polygonOffsetFactor={-10}
        transparent
        roughness={0.9}
        clearcoat={0.1}
        depthTest={false}
        depthWrite={false}
      />
    </Decal>
  );
}

/* ═══════════════════════════════════════════════════
   EXPORT HANDLER
   ═══════════════════════════════════════════════════ */
function ExportHandler() {
  const { gl, scene, camera } = useThree();
  useEffect(() => {
    const handleExport = () => {
      const oldPixelRatio = gl.getPixelRatio();
      gl.setPixelRatio(2);
      gl.render(scene, camera);
      const dataURL = gl.domElement.toDataURL("image/png");
      gl.setPixelRatio(oldPixelRatio);
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = `mockup-${Date.now()}.png`;
      link.click();
    };
    window.addEventListener("tbc:export-mockup", handleExport);
    return () => window.removeEventListener("tbc:export-mockup", handleExport);
  }, [gl, scene, camera]);
  return null;
}

/* ═══════════════════════════════════════════════════
   REALISTIC T-SHIRT
   ═══════════════════════════════════════════════════ */
function RealisticTShirt({ onDragChange }: { onDragChange: (v: boolean) => void }) {
  const group = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const isDraggingRef = useRef(false);

  const { nodes, materials } = useGLTF("/models/tshirt.glb") as any;
  const { color, graphics, activeGraphicId, updateGraphic, autoRotate, windEnabled } =
    useDesignStore();
  const { gl, camera } = useThree();

  // Stable refs so the window event handler closure never goes stale
  const activeGraphicIdRef = useRef(activeGraphicId);
  useEffect(() => { activeGraphicIdRef.current = activeGraphicId; }, [activeGraphicId]);
  const updateGraphicRef = useRef(updateGraphic);
  useEffect(() => { updateGraphicRef.current = updateGraphic; }, [updateGraphic]);

  // Bounding box from all mesh nodes → correct 1-unit normalisation
  const normalizedScale = useMemo(() => {
    const box = new THREE.Box3();
    Object.values(nodes).forEach((node) => {
      const mesh = node as THREE.Mesh;
      if (mesh.isMesh && mesh.geometry) {
        mesh.geometry.computeBoundingBox();
        if (mesh.geometry.boundingBox) box.union(mesh.geometry.boundingBox);
      }
    });
    if (box.isEmpty()) return 1;
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    return maxDim > 0 ? 1 / maxDim : 1;
  }, [nodes]);

  // Upgrade to MeshPhysical + wind shader
  const upgradedMaterials = useMemo(() => {
    const newMats: Record<string, THREE.MeshPhysicalMaterial> = {};
    for (const [key, mat] of Object.entries(materials)) {
      const oldMat = mat as THREE.MeshStandardMaterial;
      const newMat = new THREE.MeshPhysicalMaterial({
        name: oldMat.name,
        color: oldMat.color,
        map: oldMat.map,
        normalMap: oldMat.normalMap,
        roughnessMap: oldMat.roughnessMap,
        roughness: 0.8,
        metalness: 0,
        sheen: 0.4,
        sheenColor: new THREE.Color("#ffffff"),
        sheenRoughness: 0.6,
        side: THREE.DoubleSide,
      });
      newMat.onBeforeCompile = (shader) => {
        shader.uniforms.uTime = { value: 0 };
        newMat.userData.shader = shader;
        shader.vertexShader = shader.vertexShader.replace(
          "#include <common>",
          `#include <common>\nuniform float uTime;`
        );
        shader.vertexShader = shader.vertexShader.replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>
          float fade = smoothstep(0.4, -0.6, position.y);
          transformed.x += sin(uTime * 1.4 + position.y * 6.0) * 0.012 * fade;
          transformed.z += cos(uTime * 1.1 + position.y * 5.0 + position.x * 3.0) * 0.015 * fade;`
        );
      };
      newMats[key] = newMat;
    }
    return newMats;
  }, [materials]);

  // Sync shirt colour
  useEffect(() => {
    Object.values(upgradedMaterials).forEach((mat) => {
      mat.color.set(color);
      mat.needsUpdate = true;
    });
  }, [color, upgradedMaterials]);

  // Animation: auto-rotate + wind uTime (paused while dragging)
  useFrame((_state, delta) => {
    if (group.current && autoRotate && !isDraggingRef.current) {
      group.current.rotation.y += delta * 0.15;
    }
    if (windEnabled) {
      Object.values(upgradedMaterials).forEach((mat) => {
        if (mat.userData?.shader) mat.userData.shader.uniforms.uTime.value += delta;
      });
    }
  });

  // Window-level pointer events for smooth drag across the whole canvas
  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      if (!isDraggingRef.current || !meshRef.current || !activeGraphicIdRef.current) return;

      const rect = gl.domElement.getBoundingClientRect();
      const ndcX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ndcY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      const ray = new THREE.Raycaster();
      ray.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera);
      const hits = ray.intersectObject(meshRef.current, false);

      if (hits.length > 0) {
        const local = meshRef.current.worldToLocal(hits[0].point.clone());
        updateGraphicRef.current(activeGraphicIdRef.current!, {
          x: Math.max(-1, Math.min(1, local.x / X_SCALE)),
          y: Math.max(-1, Math.min(1, (local.y - CHEST_Y) / Y_RANGE)),
        });
      }
    };

    const handleUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        onDragChange(false);
      }
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
  }, [gl, camera, onDragChange]);

  const handlePointerDown = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      if (!activeGraphicIdRef.current) return;
      e.stopPropagation(); // prevent OrbitControls
      isDraggingRef.current = true;
      onDragChange(true);
    },
    [onDragChange]
  );

  const hasActiveGraphic = !!activeGraphicId;

  return (
    <Bounds fit clip observe margin={1.2}>
      <Center>
        <group ref={group} scale={normalizedScale} dispose={null}>
          <group rotation={[-1.661, 0.003, -0.504]}>
            <group rotation={[Math.PI / 2, 0, 0]}>
              {/* Collar / ribbing */}
              <mesh geometry={nodes.Object_6.geometry} material={upgradedMaterials.Body_FRONT_2664} castShadow receiveShadow />
              <mesh geometry={nodes.Object_8.geometry} material={upgradedMaterials.Body_FRONT_2664} castShadow receiveShadow />

              {/* Front body — drag target + decal host */}
              <mesh
                ref={meshRef}
                geometry={nodes.Object_10.geometry}
                material={upgradedMaterials.Body_FRONT_2664}
                castShadow
                receiveShadow
                onPointerDown={hasActiveGraphic ? handlePointerDown : undefined}
              >
                {graphics.map((g) => (
                  <GraphicDecal key={g.id} graphic={g} />
                ))}
              </mesh>

              <mesh geometry={nodes.Object_11.geometry} material={upgradedMaterials.Body_FRONT_2664} castShadow receiveShadow />
              <mesh geometry={nodes.Object_12.geometry} material={upgradedMaterials.Body_FRONT_2664} castShadow receiveShadow />
              <mesh geometry={nodes.Object_14.geometry} material={upgradedMaterials.Body_FRONT_2664} castShadow receiveShadow />
              <mesh geometry={nodes.Object_15.geometry} material={upgradedMaterials.Body_FRONT_2664} castShadow receiveShadow />
              <mesh geometry={nodes.Object_16.geometry} material={upgradedMaterials.Body_FRONT_2664} castShadow receiveShadow />

              {/* Sleeves */}
              <mesh geometry={nodes.Object_18.geometry} material={upgradedMaterials.Sleeves_FRONT_2669} castShadow receiveShadow />
              <mesh geometry={nodes.Object_20.geometry} material={upgradedMaterials.Sleeves_FRONT_2669} castShadow receiveShadow />
            </group>
          </group>
        </group>
      </Center>
    </Bounds>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN CANVAS EXPORT
   ═══════════════════════════════════════════════════ */
export function GarmentCanvas() {
  const [isDragging, setIsDragging] = useState(false);
  const { activeGraphicId } = useDesignStore();

  return (
    <div
      className="w-full h-full"
      style={{ cursor: isDragging ? "grabbing" : activeGraphicId ? "grab" : "default" }}
    >
      <Canvas
        camera={{ position: [0, 0.5, 4.5], fov: 40 }}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
          preserveDrawingBuffer: true,
        }}
        dpr={[1, 2]}
      >
        <ExportHandler />
        <Environment preset="studio" background={false} />
        <RealisticTShirt onDragChange={setIsDragging} />
        <ContactShadows
          position={[0, -1.5, 0]}
          opacity={0.3}
          scale={5}
          blur={2.5}
          far={3}
          color="#000000"
        />
        <OrbitControls
          enabled={!isDragging}
          enablePan={false}
          minDistance={2}
          maxDistance={6}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2 + 0.1}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
}
