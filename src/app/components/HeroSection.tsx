'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

export interface HeroSlide {
  src: string;
  alt: string;
}

interface HeroSectionProps {
  slides?: HeroSlide[];
}

export default function HeroSection({ slides = [] }: HeroSectionProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [flexible, setFlexible] = useState(false);

  const nextSlide = useCallback(() => {
    if (slides.length > 0) {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }
  }, [slides.length]);

  useEffect(() => {
    setActiveSlide(0);
  }, [slides]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 2000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      {/* Slideshow */}
      {slides?.map((slide, i) => (
        <div
          key={i}
          className={`hero-slide ${i === activeSlide ? 'active' : ''}`}
          style={{ zIndex: i === activeSlide ? 1 : 0 }}
        >
          <AppImage
            src={slide?.src}
            alt={slide?.alt}
            fill
            priority={i === 0}
            className="object-cover object-center scale-105"
            sizes="100vw"
          />
        </div>
      ))}
      {/* Gradient Scrim */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/75 via-black/35 to-black/20" />
      {/* Rotating Badge */}
      <div className="absolute top-28 right-8 md:right-16 z-20 pointer-events-none hidden md:block">
        <div className="relative w-24 h-24 flex items-center justify-center">
          <svg className="animate-spin-slow w-full h-full" viewBox="0 0 100 100">
            <defs>
              <path
                id="heroCircle"
                d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                fill="transparent"
              />
            </defs>
            <text
              fontSize="9.5"
              fontFamily="var(--font-dm-sans)"
              fontWeight="500"
              letterSpacing="2.5px"
              fill="white"
              opacity="0.85"
            >
              <textPath href="#heroCircle" startOffset="0%">
                ANGUILLA • CARIBBEAN • LUXURY •
              </textPath>
            </text>
          </svg>
          <div className="absolute w-8 h-8 rounded-full border border-white/40 flex items-center justify-center">
            <Icon name="StarIcon" size={14} className="text-accent" variant="solid" />
          </div>
        </div>
      </div>
      {/* Hero Content */}
      <div className="relative z-20 flex flex-col justify-end min-h-screen pb-0 px-6 md:px-16 pt-32">
        <div className="max-w-screen-xl mx-auto w-full">
          {/* Eyebrow */}
          <div className="animate-enter delay-100">
            <span className="inline-flex items-center gap-2 glass-dark text-white/90 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-accent" />
              World&apos;s Best Caribbean Island — 4 Years Running
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-hero-xl text-white font-light tracking-tight leading-none mb-6 animate-enter delay-200 max-w-4xl">
            Anguilla
            <br />
            <span className="italic text-white/70">Villa B on the Sea</span>
          </h1>

          {/* Subheadline */}
          <p className="text-white/75 text-lg md:text-xl font-light max-w-xl leading-relaxed mb-10 animate-enter delay-300">
            A private 5-bedroom beachfront villa on Sandy Hill Beach — 2 pools, home theater,
            gourmet kitchen, and full concierge service.
          </p>
        </div>

        {/* Availability Widget */}
        <div className="w-full bg-stone-900/90 backdrop-blur-md border-t border-white/10 animate-enter delay-500">
          <div className="max-w-screen-xl mx-auto px-6 md:px-16 py-5">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                {/* Check In */}
                <div className="flex flex-col gap-1">
                  <label className="text-white/80 text-xs uppercase tracking-widest font-semibold">
                    Check-In
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e?.target?.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white text-sm placeholder-white/50 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-stone-900/20 transition-colors"
                    />
                  </div>
                </div>
                {/* Check Out */}
                <div className="flex flex-col gap-1">
                  <label className="text-white/80 text-xs uppercase tracking-widest font-semibold">
                    Check-Out
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e?.target?.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white text-sm placeholder-white/50 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-stone-900/20 transition-colors"
                  />
                </div>
                {/* Flexible Dates */}
                <div className="flex flex-col gap-1 justify-end">
                  <label className="text-white/50 text-xs uppercase tracking-widest font-semibold invisible">
                    &nbsp;
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer py-2.5">
                    <div
                      onClick={() => setFlexible(!flexible)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        flexible ? 'bg-accent border-accent' : 'border-white/40'
                      }`}
                    >
                      {flexible && <Icon name="CheckIcon" size={12} className="text-white" />}
                    </div>
                    <span className="text-white/80 text-sm">Flexible Dates</span>
                  </label>
                </div>
                {/* CTA */}
                <div className="flex flex-col gap-1 justify-end">
                  <label className="text-white/50 text-xs uppercase tracking-widest font-semibold invisible">
                    &nbsp;
                  </label>
                  <Link
                    href="/book-now"
                    className="btn-accent text-sm text-center flex items-center justify-center gap-2 py-2.5"
                  >
                    Inquire Now
                    <Icon name="ArrowRightIcon" size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
