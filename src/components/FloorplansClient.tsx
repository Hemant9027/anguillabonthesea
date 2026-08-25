"use client"
import React, { useState, useCallback } from 'react'
import Image from 'next/image'
import Lightbox from './Lightbox'

export default function FloorplansClient({ images }: { images: string[] }) {
  const [index, setIndex] = useState<number | null>(null)
  const open = useCallback((i: number) => setIndex(i), [])
  const close = useCallback(() => setIndex(null), [])
  const next = useCallback(() => setIndex((v) => (v === null ? null : (v + 1) % images.length)), [images.length])
  const prev = useCallback(() => setIndex((v) => (v === null ? null : (v - 1 + images.length) % images.length)), [images.length])

  if (!images || images.length === 0) {
    return <p className="text-center text-slate-500 py-24">No floorplan images available.</p>
  }

  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {images.map((src, i) => (
          <button key={src} onClick={() => open(i)} className="relative overflow-hidden rounded-lg h-64 md:h-96 group">
            <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
              <Image src={src} alt={`Floorplan ${i + 1}`} fill className="object-contain bg-white" sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
          </button>
        ))}
      </div>

      {index !== null && <Lightbox images={images} index={index} onClose={close} onNext={next} onPrev={prev} />}
    </section>
  )
}
