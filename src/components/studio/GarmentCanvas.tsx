"use client";

import { useRef, useMemo, useEffect, useLayoutEffect, useState, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  useTexture,
  useGLTF,
  Center,
  Bounds,
} from "@react-three/drei";
import { DecalGeometry } from "three-stdlib";
import * as THREE from "three";
import { useDesignStore, type GraphicLayer } from "@/store/designStore";

useGLTF.preload("/models/tshirt.glb");

// Coordinate mapping (GLB local space)
const CHEST_Y    = 1.29;
const DECAL_Z    = 0.16;
const X_SCALE    = 0.1;
const Y_RANGE    = 0.3;
const SIZE_SCALE = 0.15;

// Shared wind GLSL — injected into both the shirt and decal vertex shaders
// so the graphic deforms in perfect lockstep with the fabric.
const WIND_VERT = `
  float tNorm  = clamp((position.y - 0.93) / 0.71, 0.0, 1.0);
  float hang   = (1.0 - tNorm) * (1.0 - tNorm);
  float sway   = sin(uTime * 0.65 + position.x * 0.9)                      * 0.052;
  float ripX   = sin(uTime * 1.75 + position.y * 3.0  + position.x * 2.2)  * 0.024;
  float ripZ   = cos(uTime * 1.40 + position.y * 2.6  - position.x * 2.5)  * 0.032;
  float flutt  = sin(uTime * 3.60 + position.y * 7.0  + position.x * 5.2)  * 0.010;
  float bounce = sin(uTime * 1.10 + position.x * 2.8) * 0.014
                 * (1.0 - smoothstep(0.0, 0.25, tNorm));
  transformed.x += (sway + ripX + flutt) * hang * uWindStrength;
  transformed.y += bounce * uWindStrength;
  transformed.z += ripZ  * hang * uWindStrength;
`;

function injectWind(shader: THREE.WebGLProgramParametersWithUniforms, mat: THREE.Material) {
  shader.uniforms.uTime         = { value: 0 };
  shader.uniforms.uWindStrength = { value: 0 };
  mat.userData.shader = shader;

  shader.vertexShader = shader.vertexShader
    .replace(
      "#include <common>",
      "#include <common>\nuniform float uTime;\nuniform float uWindStrength;"
    )
    .replace(
      "#include <begin_vertex>",
      `#include <begin_vertex>\n${WIND_VERT}`
    );
}

/* ═══════════════════════════════════════════════════════
   PER-GRAPHIC DECAL
   Uses a manually-built DecalGeometry + a wind-enabled
   MeshPhysicalMaterial driven by the same windRef as the
   shirt, so the graphic deforms in exact sync.
   ═══════════════════════════════════════════════════════ */
type WindRef = React.RefObject<{ time: number; strength: number }>;

function GraphicDecal({
  graphic,
  parentRef,
  windRef,
}: {
  graphic: GraphicLayer;
  parentRef: React.RefObject<THREE.Mesh | null>;
  windRef: WindRef;
}) {
  const texture = useTexture(graphic.imageUrl);

  // Wind material — compiled once, texture updated in place.
  const windMaterial = useMemo(() => {
    const mat = new THREE.MeshPhysicalMaterial({
      transparent: true,
      polygonOffset: true,
      polygonOffsetFactor: -10,
      roughness: 0.9,
      clearcoat: 0.1,
      depthTest: false,
      depthWrite: false,
    });
    mat.onBeforeCompile = (shader) => injectWind(shader, mat);
    return mat;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Dispose on unmount
  useEffect(() => () => windMaterial.dispose(), [windMaterial]);

  // Sync texture without recompiling shader
  useEffect(() => {
    texture.anisotropy    = 16;
    texture.colorSpace    = THREE.SRGBColorSpace;
    texture.needsUpdate   = true;
    windMaterial.map      = texture;
    windMaterial.needsUpdate = true;
  }, [texture, windMaterial]);

  // DecalGeometry — rebuild when position or scale changes
  const latestGeomRef = useRef<THREE.BufferGeometry | null>(null);
  const [decalGeom, setDecalGeom] = useState<THREE.BufferGeometry | null>(null);

  useLayoutEffect(() => {
    const parent = parentRef.current;
    if (!parent) return;

    const mwBackup = parent.matrixWorld.clone();
    parent.matrixWorld.identity();

    const geom = new DecalGeometry(
      parent,
      new THREE.Vector3(graphic.x * X_SCALE, CHEST_Y + graphic.y * Y_RANGE, DECAL_Z),
      new THREE.Euler(0, 0, 0),
      new THREE.Vector3(graphic.scale * SIZE_SCALE, graphic.scale * SIZE_SCALE, 0.25)
    );

    parent.matrixWorld = mwBackup;

    latestGeomRef.current?.dispose();
    latestGeomRef.current = geom;
    setDecalGeom(geom);
  // parentRef is stable — graphic values are the real deps
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graphic.x, graphic.y, graphic.scale]);

  useEffect(() => () => latestGeomRef.current?.dispose(), []);

  // Mirror wind uniforms from the shared ref so graphic moves with the shirt
  useFrame(() => {
    const s = windMaterial.userData?.shader;
    if (!s) return;
    s.uniforms.uTime.value         = windRef.current.time;
    s.uniforms.uWindStrength.value = windRef.current.strength;
  });

  if (!decalGeom) return null;
  return <mesh geometry={decalGeom} material={windMaterial} />;
}

/* ═══════════════════════════════════════════════════════
   EXPORT HANDLER
   ═══════════════════════════════════════════════════════ */
function ExportHandler() {
  const { gl, scene, camera } = useThree();
  useEffect(() => {
    const handle = () => {
      const old = gl.getPixelRatio();
      gl.setPixelRatio(2);
      gl.render(scene, camera);
      const url = gl.domElement.toDataURL("image/png");
      gl.setPixelRatio(old);
      const a = document.createElement("a");
      a.href = url;
      a.download = `mockup-${Date.now()}.png`;
      a.click();
    };
    window.addEventListener("tbc:export-mockup", handle);
    return () => window.removeEventListener("tbc:export-mockup", handle);
  }, [gl, scene, camera]);
  return null;
}

/* ═══════════════════════════════════════════════════════
   REALISTIC T-SHIRT
   ═══════════════════════════════════════════════════════ */
function RealisticTShirt({ onDragChange }: { onDragChange: (v: boolean) => void }) {
  const group       = useRef<THREE.Group>(null);
  const meshRef     = useRef<THREE.Mesh>(null);
  const isDragging  = useRef(false);
  // Shared wind state read by every GraphicDecal this frame
  const windRef     = useRef({ time: 0, strength: 0 });

  const { nodes, materials } = useGLTF("/models/tshirt.glb") as any;
  const { color, graphics, activeGraphicId, updateGraphic, autoRotate, windEnabled } =
    useDesignStore();
  const { gl, camera } = useThree();

  const activeIdRef     = useRef(activeGraphicId);
  useEffect(() => { activeIdRef.current = activeGraphicId; }, [activeGraphicId]);
  const updateRef       = useRef(updateGraphic);
  useEffect(() => { updateRef.current = updateGraphic; }, [updateGraphic]);

  // Scale so max dimension = 1 unit
  const normalizedScale = useMemo(() => {
    const box = new THREE.Box3();
    Object.values(nodes).forEach((n) => {
      const m = n as THREE.Mesh;
      if (m.isMesh && m.geometry) {
        m.geometry.computeBoundingBox();
        if (m.geometry.boundingBox) box.union(m.geometry.boundingBox);
      }
    });
    if (box.isEmpty()) return 1;
    const s = new THREE.Vector3();
    box.getSize(s);
    const d = Math.max(s.x, s.y, s.z);
    return d > 0 ? 1 / d : 1;
  }, [nodes]);

  // MeshPhysical + same wind shader
  const upgradedMaterials = useMemo(() => {
    const out: Record<string, THREE.MeshPhysicalMaterial> = {};
    for (const [key, mat] of Object.entries(materials)) {
      const old = mat as THREE.MeshStandardMaterial;
      const next = new THREE.MeshPhysicalMaterial({
        name: old.name, color: old.color, map: old.map,
        normalMap: old.normalMap, roughnessMap: old.roughnessMap,
        roughness: 0.8, metalness: 0,
        sheen: 0.4, sheenColor: new THREE.Color("#ffffff"), sheenRoughness: 0.6,
        side: THREE.DoubleSide,
      });
      next.onBeforeCompile = (shader) => injectWind(shader, next);
      out[key] = next;
    }
    return out;
  }, [materials]);

  useEffect(() => {
    Object.values(upgradedMaterials).forEach((m) => { m.color.set(color); m.needsUpdate = true; });
  }, [color, upgradedMaterials]);

  // Animation loop — maintain shared windRef so decals stay in sync
  useFrame((_s, delta) => {
    if (group.current && autoRotate && !isDragging.current)
      group.current.rotation.y += delta * 0.15;

    const target = windEnabled ? 1.0 : 0.0;
    windRef.current.time     += delta;
    windRef.current.strength += (target - windRef.current.strength) * Math.min(1, delta * 2);

    Object.values(upgradedMaterials).forEach((m) => {
      const s = m.userData?.shader;
      if (!s) return;
      s.uniforms.uTime.value         = windRef.current.time;
      s.uniforms.uWindStrength.value = windRef.current.strength;
    });
  });

  // Window-level drag tracking
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!isDragging.current || !meshRef.current || !activeIdRef.current) return;
      const rect = gl.domElement.getBoundingClientRect();
      const ray  = new THREE.Raycaster();
      ray.setFromCamera(
        new THREE.Vector2(
          ((e.clientX - rect.left) / rect.width)  *  2 - 1,
          ((e.clientY - rect.top)  / rect.height) * -2 + 1
        ),
        camera
      );
      const hits = ray.intersectObject(meshRef.current, false);
      if (!hits.length) return;
      const p = meshRef.current.worldToLocal(hits[0].point.clone());
      updateRef.current(activeIdRef.current, {
        x: Math.max(-1, Math.min(1, p.x / X_SCALE)),
        y: Math.max(-1, Math.min(1, (p.y - CHEST_Y) / Y_RANGE)),
      });
    };
    const onUp = () => {
      if (isDragging.current) { isDragging.current = false; onDragChange(false); }
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup",   onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup",   onUp);
    };
  }, [gl, camera, onDragChange]);

  const onPointerDown = useCallback((e: ThreeEvent<PointerEvent>) => {
    if (!activeIdRef.current) return;
    e.stopPropagation();
    isDragging.current = true;
    onDragChange(true);
  }, [onDragChange]);

  return (
    <Bounds fit clip observe margin={1.2}>
      <Center>
        <group ref={group} scale={normalizedScale} dispose={null}>
          <group rotation={[-1.661, 0.003, -0.504]}>
            <group rotation={[Math.PI / 2, 0, 0]}>
              <mesh geometry={nodes.Object_6.geometry}  material={upgradedMaterials.Body_FRONT_2664}  castShadow receiveShadow />
              <mesh geometry={nodes.Object_8.geometry}  material={upgradedMaterials.Body_FRONT_2664}  castShadow receiveShadow />

              {/* Front body — drag target + decal host */}
              <mesh
                ref={meshRef}
                geometry={nodes.Object_10.geometry}
                material={upgradedMaterials.Body_FRONT_2664}
                castShadow receiveShadow
                onPointerDown={activeGraphicId ? onPointerDown : undefined}
              >
                {graphics.map((g) => (
                  <GraphicDecal key={g.id} graphic={g} parentRef={meshRef} windRef={windRef} />
                ))}
              </mesh>

              <mesh geometry={nodes.Object_11.geometry} material={upgradedMaterials.Body_FRONT_2664}  castShadow receiveShadow />
              <mesh geometry={nodes.Object_12.geometry} material={upgradedMaterials.Body_FRONT_2664}  castShadow receiveShadow />
              <mesh geometry={nodes.Object_14.geometry} material={upgradedMaterials.Body_FRONT_2664}  castShadow receiveShadow />
              <mesh geometry={nodes.Object_15.geometry} material={upgradedMaterials.Body_FRONT_2664}  castShadow receiveShadow />
              <mesh geometry={nodes.Object_16.geometry} material={upgradedMaterials.Body_FRONT_2664}  castShadow receiveShadow />
              <mesh geometry={nodes.Object_18.geometry} material={upgradedMaterials.Sleeves_FRONT_2669} castShadow receiveShadow />
              <mesh geometry={nodes.Object_20.geometry} material={upgradedMaterials.Sleeves_FRONT_2669} castShadow receiveShadow />
            </group>
          </group>
        </group>
      </Center>
    </Bounds>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN CANVAS EXPORT
   ═══════════════════════════════════════════════════════ */
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
        <ContactShadows position={[0, -1.5, 0]} opacity={0.3} scale={5} blur={2.5} far={3} color="#000000" />
        <OrbitControls
          enabled={!isDragging}
          enablePan={false}
          minDistance={2} maxDistance={6}
          minPolarAngle={Math.PI / 6} maxPolarAngle={Math.PI / 2 + 0.1}
          enableDamping dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
}
