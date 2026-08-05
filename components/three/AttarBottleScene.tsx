"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Float,
  Lightformer,
  Sparkles,
} from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import AttarBottle from "./AttarBottle";
import OudPieces from "./OudPieces";
import FragranceMist from "./FragranceMist";

function BottleRig({ lowPower }: { lowPower: boolean }) {
  const { viewport } = useThree();
  const rig = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const isMobile = viewport.width < 7.5;

  useFrame((state, delta) => {
    const group = rig.current;
    if (!group) return;

    const targetX = isMobile ? 0 : viewport.width * 0.235;
    const targetScale =
      THREE.MathUtils.clamp(viewport.height / 4.1, 0.75, 1.15) *
      (isMobile ? 0.55 : 1);
    const targetY = isMobile ? -viewport.height * 0.05 : 0;

    group.position.x = THREE.MathUtils.lerp(group.position.x, targetX, 0.04);
    group.position.y = THREE.MathUtils.lerp(group.position.y, targetY, 0.04);
    const s = THREE.MathUtils.lerp(group.scale.x, targetScale, 0.04);
    group.scale.setScalar(s);
    group.rotation.x = THREE.MathUtils.lerp(
      group.rotation.x,
      -state.pointer.y * 0.12,
      0.06,
    );
    group.rotation.z = THREE.MathUtils.lerp(
      group.rotation.z,
      state.pointer.x * 0.06,
      0.06,
    );

    if (spin.current) spin.current.rotation.y += delta * (isMobile ? 0.06 : 0.1);
  });

  return (
    <group ref={rig}>
      <group ref={spin}>
        <Float speed={1.8} rotationIntensity={0.15} floatIntensity={0.7}>
          <AttarBottle lowPower={lowPower} />
        </Float>
        <OudPieces />
      </group>
      <FragranceMist count={lowPower ? 36 : 70} />
    </group>
  );
}

function Scene() {
  const { viewport } = useThree();
  const lowPower = viewport.width < 7.5;

  return (
    <Suspense fallback={null}>
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 4]} intensity={1.6} color="#ffe9c0" />
      <pointLight position={[-5, 2, -2]} intensity={0.7} color="#8a6b3d" />
      <pointLight position={[0, -2, 4]} intensity={0.4} color="#e3c795" />
      <spotLight
        position={[0, 6, 4]}
        angle={0.5}
        penumbra={1}
        intensity={1.8}
        color="#ffe3a3"
      />

      <BottleRig lowPower={lowPower} />

      <Sparkles
        count={lowPower ? 60 : 140}
        scale={lowPower ? [7, 5, 6] : [9, 7, 8]}
        size={lowPower ? 2.4 : 3.2}
        speed={0.35}
        opacity={lowPower ? 0.5 : 0.65}
        color="#e3c795"
      />

      <ContactShadows
        position={[0, -2.1, 0]}
        opacity={0.55}
        scale={14}
        blur={2.6}
        far={4}
        color="#000000"
        frames={1}
        resolution={256}
      />

      <Environment resolution={lowPower ? 128 : 256}>
        <Lightformer
          intensity={2.4}
          rotation-x={Math.PI / 2}
          position={[0, 5, -9]}
          scale={[12, 1, 1]}
          color="#fff2d6"
        />
        <Lightformer
          intensity={1.2}
          rotation-y={Math.PI / 2}
          position={[-5, 1, -1]}
          scale={[20, 0.6, 1]}
          color="#e3c795"
        />
        <Lightformer
          intensity={1.6}
          rotation-y={-Math.PI / 2}
          position={[6, 2, 0]}
          scale={[20, 1.2, 1]}
          color="#ffd77a"
        />
      </Environment>

      {!lowPower && (
        <EffectComposer>
          <Bloom
            mipmapBlur
            intensity={0.9}
            luminanceThreshold={0.18}
            luminanceSmoothing={0.85}
            radius={0.7}
          />
        </EffectComposer>
      )}
    </Suspense>
  );
}

export default function AttarBottleScene() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        setVisible(entries[0]?.isIntersecting ?? true);
      },
      { threshold: 0.02 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="absolute inset-0">
      <Canvas
        frameloop={visible ? "always" : "never"}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.4, 8], fov: 35 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          failIfMajorPerformanceCaveat: false,
        }}
        performance={{ min: 0.5 }}
        style={{ position: "absolute", inset: 0 }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
