import React from "react";
import AppImage from "@/components/ui/AppImage";

export default function RatesHero() {
  return (
    <section className="relative w-full h-[55vh] min-h-[380px] overflow-hidden">
      <AppImage
        src="https://img.rocket.new/generatedImages/rocket_gen_img_13ae9f615-1785414593638.png"
        alt="Luxury villa pool at sunset with Caribbean sea view, warm amber glow, deep shadows, dramatic low-light atmosphere"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-black/25" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pt-20">
        <span className="inline-block px-4 py-1.5 rounded-full border border-white/20 text-xs font-semibold text-white/80 uppercase tracking-widest mb-6 animate-enter">
          Pricing
        </span>
        <h1 className="font-display text-hero-xl text-white font-light tracking-tight animate-enter delay-200">
          Villa Rental & Rates
        </h1>
        <p className="text-white/70 text-lg mt-4 max-w-xl animate-enter delay-300">
          Transparent seasonal pricing with flexible booking options for your
          perfect Anguilla stay.
        </p>
      </div>
    </section>
  );
}
