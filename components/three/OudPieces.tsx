"use client";

import { Float } from "@react-three/drei";

type Piece = {
  id: number;
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number, number];
  speed: number;
  rotationIntensity: number;
  floatIntensity: number;
  color: string;
};

const pieces: Piece[] = [
  {
    id: 1,
    position: [-1.9, 0.55, -0.4],
    rotation: [0.4, 0.8, 0.2],
    size: [0.8, 0.14, 0.28],
    speed: 1.8,
    rotationIntensity: 1.1,
    floatIntensity: 0.9,
    color: "#5d3d24",
  },
  {
    id: 2,
    position: [1.7, 0.2, 0.5],
    rotation: [-0.3, -0.6, 0.5],
    size: [0.5, 0.1, 0.2],
    speed: 2.2,
    rotationIntensity: 1.4,
    floatIntensity: 1,
    color: "#6b4a2f",
  },
  {
    id: 3,
    position: [-1.5, -0.55, 0.7],
    rotation: [0.7, -0.3, -0.2],
    size: [0.6, 0.12, 0.24],
    speed: 1.5,
    rotationIntensity: 0.9,
    floatIntensity: 0.7,
    color: "#4a2f1b",
  },
  {
    id: 4,
    position: [2, -0.3, -0.7],
    rotation: [-0.6, 0.5, 0.3],
    size: [0.42, 0.1, 0.18],
    speed: 2.6,
    rotationIntensity: 1.6,
    floatIntensity: 1.1,
    color: "#7a5533",
  },
  {
    id: 5,
    position: [-0.6, 1.05, -1.5],
    rotation: [0.2, 0.9, -0.4],
    size: [0.5, 0.1, 0.2],
    speed: 2,
    rotationIntensity: 1.2,
    floatIntensity: 0.8,
    color: "#5d3d24",
  },
  {
    id: 6,
    position: [0.9, -0.9, -1.2],
    rotation: [-0.4, 1.1, 0.2],
    size: [0.62, 0.11, 0.22],
    speed: 1.7,
    rotationIntensity: 1.3,
    floatIntensity: 0.9,
    color: "#6b4a2f",
  },
];

export default function OudPieces() {
  return (
    <>
      {pieces.map((piece) => (
        <Float
          key={piece.id}
          speed={piece.speed}
          rotationIntensity={piece.rotationIntensity}
          floatIntensity={piece.floatIntensity}
        >
          <mesh
            position={piece.position}
            rotation={piece.rotation}
            castShadow
          >
            <boxGeometry args={piece.size} />
            <meshStandardMaterial color={piece.color} roughness={0.85} />
          </mesh>
        </Float>
      ))}
    </>
  );
}
