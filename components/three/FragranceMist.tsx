"use client";

import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

const MIST_TOP = 3.4;
const MIST_RESET = 1.95;

export default function FragranceMist({ count = 70 }: { count?: number }) {
  const points = useRef<THREE.Points>(null);
  const frame = useRef(0);

  const [data] = useState(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const radius = 0.04 + Math.random() * 0.3;
      const angle = Math.random() * Math.PI * 2;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = MIST_RESET + Math.random() * 0.2;
      pos[i * 3 + 2] = Math.sin(angle) * radius * 0.6;
      spd[i] = 0.35 + Math.random() * 0.7;
    }
    return { positions: pos, speeds: spd };
  });
  const { positions, speeds } = data;

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  const texture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, "rgba(255, 240, 210, 0.9)");
    gradient.addColorStop(0.35, "rgba(255, 236, 200, 0.3)");
    gradient.addColorStop(1, "rgba(255, 236, 200, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((_, delta) => {
    const pts = points.current;
    if (!pts) return;
    frame.current += 1;
    if (frame.current % 2 !== 0) return;
    const attr = pts.geometry.getAttribute("position") as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      let y = arr[i * 3 + 1];
      y += speeds[i] * delta * 2;
      if (y > MIST_TOP) {
        y = MIST_RESET;
        arr[i * 3] = (Math.random() - 0.5) * 0.6;
        arr[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
      }
      arr[i * 3 + 1] = y;
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={points} geometry={geometry}>
      {texture && (
        <pointsMaterial
          map={texture}
          size={0.45}
          transparent
          depthWrite={false}
          opacity={0.55}
          blending={THREE.AdditiveBlending}
          color="#ffe9c2"
          sizeAttenuation
        />
      )}
    </points>
  );
}
