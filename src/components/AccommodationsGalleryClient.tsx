'use client';
import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import Lightbox from './Lightbox';

type Props = {
  images: string[];
};

export default function AccommodationsGalleryClient({ images }: Props) {
  const [index, setIndex] = useState<number | null>(null);

  const open = useCallback((i: number) => setIndex(i), []);
  const close = useCallback(() => setIndex(null), []);
  const next = useCallback(
    () => setIndex((v) => (v === null ? null : (v + 1) % images.length)),
    [images.length]
  );
  const prev = useCallback(
    () => setIndex((v) => (v === null ? null : (v - 1 + images.length) % images.length)),
    [images.length]
  );

  if (!images || images.length === 0) {
    return <p className="text-center text-slate-500 py-24">No bedroom images available.</p>;
  }

  return (
    <section>
      <div className="grid grid-cols-12 gap-4 auto-rows-[200px] md:auto-rows-[240px]">
        {images.map((src, i) => {
          // Define editorial sizes by index to create rhythm
          const pattern = i % 6;
          let className = 'col-span-6 row-span-2';
          if (pattern === 0) className = 'col-span-8 row-span-2 md:col-span-7';
          if (pattern === 1 || pattern === 2) className = 'col-span-3 row-span-1 md:col-span-4';
          if (pattern === 3) className = 'col-span-6 row-span-2 md:col-span-5';

          return (
            <button
              key={src}
              onClick={() => open(i)}
              className={`${className} overflow-hidden relative group focus:outline-none rounded-lg`}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
                <Image
                  src={src}
                  alt={`Bedroom ${i + 1}`}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  fill
                  className="object-cover"
                  priority={i === 0}
                />
              </div>
            </button>
          );
        })}
      </div>

      {index !== null && (
        <Lightbox images={images} index={index} onClose={close} onNext={next} onPrev={prev} />
      )}
    </section>
  );
}
