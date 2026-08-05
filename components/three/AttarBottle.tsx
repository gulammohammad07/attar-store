"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { MeshTransmissionMaterial } from "@react-three/drei";

const GOLD = "#c6a15b";
const GOLD_LIGHT = "#e6c890";

export default function AttarBottle({ lowPower = false }: { lowPower?: boolean }) {
  const bodyPoints = useMemo(() => {
    const data: [number, number][] = [
      [0, 0],
      [0.72, 0.02],
      [0.96, 0.1],
      [1.05, 0.3],
      [1.08, 0.92],
      [1.02, 1.16],
      [0.84, 1.3],
      [0.6, 1.36],
      [0.46, 1.4],
      [0.46, 1.54],
    ];
    return data.map(([x, y]) => new THREE.Vector2(x, y));
  }, []);

  const liquidPoints = useMemo(() => {
    const data: [number, number][] = [
      [0, 0.02],
      [0.66, 0.05],
      [0.88, 0.13],
      [0.96, 0.32],
      [0.99, 0.86],
      [0.94, 1.05],
      [0.78, 1.14],
      [0, 1.16],
    ];
    return data.map(([x, y]) => new THREE.Vector2(x, y));
  }, []);

  return (
    <group>
      <mesh castShadow>
        <latheGeometry args={[bodyPoints, lowPower ? 32 : 64]} />
        {lowPower ? (
          <meshStandardMaterial
            color="#d9c9a5"
            transparent
            opacity={0.28}
            metalness={0.2}
            roughness={0.05}
            envMapIntensity={1.6}
            side={THREE.DoubleSide}
          />
        ) : (
          <MeshTransmissionMaterial
            samples={2}
            resolution={256}
            transmission={1}
            thickness={0.8}
            roughness={0.06}
            ior={1.5}
            chromaticAberration={0.03}
            anisotropicBlur={0.2}
            distortion={0.05}
            distortionScale={0.3}
            color="#eadfc0"
          />
        )}
      </mesh>

      <mesh position={[0, 0.02, 0]}>
        <latheGeometry args={[liquidPoints, lowPower ? 24 : 48]} />
        {lowPower ? (
          <meshStandardMaterial
            color="#d9a52f"
            metalness={0.5}
            roughness={0.2}
            transparent
            opacity={0.95}
            side={THREE.DoubleSide}
          />
        ) : (
          <meshPhysicalMaterial
            color="#d9a52f"
            transmission={0.55}
            thickness={0.5}
            roughness={0.15}
            metalness={0.6}
            transparent
            opacity={0.92}
            side={THREE.DoubleSide}
          />
        )}
      </mesh>

      <mesh position={[0, 1.54, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.14, 48]} />
        <meshStandardMaterial color={GOLD_LIGHT} metalness={1} roughness={0.18} />
      </mesh>

      <mesh position={[0, 0.62, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.95, 0.025, 12, 64]} />
        <meshStandardMaterial color={GOLD} metalness={1} roughness={0.3} />
      </mesh>

      <mesh position={[0, 1.98, 0]} rotation={[0, Math.PI / 4, 0]}>
        <octahedronGeometry args={[0.52, 0]} />
        <meshPhysicalMaterial
          color={GOLD_LIGHT}
          metalness={0.9}
          roughness={0.05}
          transmission={0.2}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
    </group>
  );
}
