"use client";

import { motion } from "framer-motion";
import type { FragranceNote } from "@/lib/data/products";

function NoteBar({ note, delay }: { note: FragranceNote; delay: number }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-sm font-medium text-[#1c1712]">{note.name}</span>
        <span className="text-xs text-[#1c1712]/40">{note.intensity}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[#1c1712]/10">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${note.intensity}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-[#8a6b3d] to-gold"
        />
      </div>
    </div>
  );
}

export default function NotesPyramid({
  notes,
}: {
  notes: {
    top: FragranceNote[];
    heart: FragranceNote[];
    base: FragranceNote[];
  };
}) {
  const layers = [
    { key: "top", label: "Top Notes", sub: "The first impression", notes: notes.top },
    { key: "heart", label: "Heart Notes", sub: "The soul of the scent", notes: notes.heart },
    { key: "base", label: "Base Notes", sub: "The lasting trail", notes: notes.base },
  ];

  return (
    <div className="space-y-8">
      {layers.map((layer, layerIndex) => (
        <div key={layer.key}>
          <div className="mb-4">
            <h4 className="font-display text-lg font-medium text-[#1c1712]">
              {layer.label}
            </h4>
            <p className="text-xs text-[#1c1712]/40">{layer.sub}</p>
          </div>

          <div className="space-y-3">
            {layer.notes.map((note, i) => (
              <NoteBar
                key={note.name}
                note={note}
                delay={0.1 * (i + 1) + layerIndex * 0.2}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
