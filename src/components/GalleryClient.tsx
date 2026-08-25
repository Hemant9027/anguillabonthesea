'use client';
import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import Lightbox from './Lightbox';

type Section = { key: string; label: string; images: string[] };

export default function GalleryClient({
  sections,
  hero,
}: {
  sections: Section[];
  hero: string | null;
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const navRef = useRef<HTMLDivElement | null>(null);

  const openLightbox = useCallback((images: string[], idx: number) => {
    setLightboxImages(images);
    setLightboxIndex(idx);
  }, []);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const next = useCallback(
    () => setLightboxIndex((i) => (i === null ? null : (i + 1) % lightboxImages.length)),
    [lightboxImages.length]
  );
  const prev = useCallback(
    () =>
      setLightboxIndex((i) =>
        i === null ? null : (i - 1 + lightboxImages.length) % lightboxImages.length
      ),
    [lightboxImages.length]
  );

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <main className="">
      <section className="relative h-[60vh] md:h-[72vh] w-full overflow-hidden">
        {hero ? (
          <div className="absolute inset-0">
            <Image src={hero} alt="Hero" fill className="object-cover" sizes="100vw" priority />
          </div>
        ) : (
          <div className="absolute inset-0 bg-slate-100" />
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
          <p className="text-sm tracking-widest">THE VILLA IN IMAGES</p>
          <h1 className="mt-3 text-4xl font-display">B on the Sea</h1>
          <p className="mt-3 max-w-2xl">
            Explore the villa, its private spaces, expansive decks, and breathtaking Caribbean
            surroundings.
          </p>
          <div className="absolute bottom-8 text-white/90 text-sm">EXPLORE THE GALLERY ↓</div>
        </div>
      </section>

      <nav ref={navRef} className="sticky top-0 bg-white/70 backdrop-blur-sm z-20 py-3">
        <div className="max-w-7xl mx-auto px-6 overflow-x-auto">
          <div className="flex gap-4 items-center">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-3 py-1 text-sm font-medium"
            >
              All
            </button>
            {sections.map((s) => (
              <button
                key={s.key}
                onClick={() => scrollTo(`section-${s.key}`)}
                className="px-3 py-1 text-sm font-medium whitespace-nowrap"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-20">
        {sections.map((section, si) => (
          <section id={`section-${section.key}`} key={section.key}>
            <div className="flex items-baseline justify-between mb-6">
              <div>
                <p className="text-sm text-slate-500">
                  {String(si + 1).padStart(2, '0')} — {section.label.toUpperCase()}
                </p>
                <h2 className="text-2xl font-display mt-2">
                  {section.label === 'Bedrooms'
                    ? 'Private Sanctuaries'
                    : undefined || section.label}
                </h2>
              </div>
              <div className="text-sm text-slate-500">{section.images.length} images</div>
            </div>

            <div className="grid grid-cols-12 gap-4 auto-rows-[180px] md:auto-rows-[220px]">
              {section.images.map((src, i) => {
                const pattern = i % 6;
                let className = 'col-span-12 md:col-span-6 row-span-1';
                if (pattern === 0) className = 'col-span-12 md:col-span-8 row-span-2';
                if (pattern === 1 || pattern === 2)
                  className = 'col-span-6 md:col-span-3 row-span-1';
                if (pattern === 3) className = 'col-span-12 md:col-span-6 row-span-2';

                return (
                  <button
                    key={src}
                    onClick={() => openLightbox(section.images, i)}
                    className={`${className} relative overflow-hidden group rounded-lg focus:outline-none`}
                  >
                    <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
                      <Image
                        src={src}
                        alt={`${section.label} ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-10 transition" />
                  </button>
                );
              })}
            </div>
          </section>
        ))}

        <section className="text-center">
          <h3 className="text-2xl font-display mb-4">See It in Person</h3>
          <p className="text-slate-600 mb-6">
            Experience the privacy, views, and effortless Caribbean living of B on the Sea.
          </p>
          <div className="flex items-center justify-center gap-4">
            <a href="/book-now" className="px-6 py-3 bg-slate-900 text-white rounded-md">
              Book Your Stay
            </a>
            <a href="/" className="px-6 py-3 border border-slate-200 rounded-md">
              Explore the Villa
            </a>
          </div>
        </section>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={lightboxImages}
          index={lightboxIndex}
          onClose={closeLightbox}
          onNext={next}
          onPrev={prev}
        />
      )}
    </main>
  );
}
