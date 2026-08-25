'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

const rateRows = [
  {
    from: 'May 1',
    to: 'Nov 14',
    season: 'Low Season',
    perNight: '$1,200',
    weekendNight: '$1,400',
    weekly: '$7,500',
    monthly: '$22,000',
  },
  {
    from: 'Nov 15',
    to: 'Dec 14',
    season: 'Shoulder Season',
    perNight: '$1,800',
    weekendNight: '$2,000',
    weekly: '$11,500',
    monthly: '$30,000',
  },
  {
    from: 'Dec 15',
    to: 'Jan 5',
    season: 'Holiday Peak',
    perNight: '$3,500',
    weekendNight: '$4,000',
    weekly: '$22,000',
    monthly: '—',
  },
  {
    from: 'Jan 6',
    to: 'Apr 30',
    season: 'High Season',
    perNight: '$2,500',
    weekendNight: '$2,800',
    weekly: '$16,000',
    monthly: '$42,000',
  },
];

const feeRows = [
  { label: 'Government Tax', value: '10%', note: 'Applied to total rental' },
  { label: 'Service Fee', value: '10%', note: 'Applied to total rental' },
];

export default function RatesTable() {
  const sectionRef = useRef<HTMLElement>(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [estimate, setEstimate] = useState<null | {
    nights: number;
    subtotal: number;
    tax: number;
    service: number;
    total: number;
  }>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('active');
        });
      },
      { threshold: 0.08 }
    );
    const reveals = sectionRef.current?.querySelectorAll('.reveal') ?? [];
    reveals.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const parseMoney = (s: string) => {
    const num = Number(String(s).replace(/[^0-9.]/g, ''));
    return Number.isFinite(num) ? num : 0;
  };

  function getSeasonForDate(d: Date) {
    for (const r of rateRows) {
      const parseMonthDay = (str: string, year: number) => {
        const [monthName, dayStr] = str.split(' ');
        const m = MONTHS.findIndex((m) => m.toLowerCase().startsWith(monthName.toLowerCase()));
        if (m === -1) return null;
        return new Date(year, m, Number(dayStr));
      };

      const year = d.getFullYear();
      let start = parseMonthDay(r.from, year);
      let end = parseMonthDay(r.to, year);
      if (!start || !end) continue;
      if (end < start) end = new Date(end.getFullYear() + 1, end.getMonth(), end.getDate());

      const dt = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      if (dt >= start && dt <= end) return r;
      const dtNext = new Date(dt.getFullYear() + 1, dt.getMonth(), dt.getDate());
      if (dtNext >= start && dtNext <= end) return r;
    }
    return rateRows[0];
  }

  const computeEstimate = () => {
    if (!checkIn || !checkOut) return;
    const start = new Date(checkIn + 'T00:00:00');
    const end = new Date(checkOut + 'T00:00:00');
    if (end <= start) return;
    const nights = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    let subtotal = 0;
    for (let i = 0; i < nights; i++) {
      const day = new Date(start.getTime());
      day.setDate(start.getDate() + i);
      const season = getSeasonForDate(day);
      const isWeekend = day.getDay() === 5 || day.getDay() === 6;
      const per =
        isWeekend && season.weekendNight
          ? parseMoney(season.weekendNight)
          : parseMoney(season.perNight);
      subtotal += per;
    }

    const tax = subtotal * 0.1;
    const service = subtotal * 0.1;
    const total = subtotal + tax + service;

    setEstimate({ nights, subtotal, tax, service, total });
  };

  return (
    <section ref={sectionRef} className="bg-background py-20 px-6 md:px-16">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Table */}
          <div className="lg:col-span-8">
            {/* Season Rates */}
            <div className="reveal mb-10">
              <h2 className="font-display text-2xl md:text-3xl font-medium text-foreground mb-2">
                Seasonal Rates
              </h2>
              <p className="text-muted-foreground text-sm mb-8">
                All rates are in USD per night unless otherwise noted.
              </p>

              <div className="rounded-2xl border border-border overflow-hidden card-shadow">
                {/* Table Header */}
                <div className="bg-primary text-foreground grid grid-cols-6 gap-0 text-xs font-bold uppercase tracking-widest">
                  <div className="px-5 py-4 col-span-2">Season</div>
                  <div className="px-4 py-4">Per Night</div>
                  <div className="px-4 py-4">Weekend</div>
                  <div className="px-4 py-4">Weekly</div>
                  <div className="px-4 py-4">Monthly</div>
                </div>
                {rateRows.map((row, i) => (
                  <div
                    key={i}
                    className={`rate-row grid grid-cols-6 gap-0 border-t border-border hover:bg-accent/5 transition-colors group`}
                  >
                    <div className="px-5 py-4 col-span-2">
                      <p className="font-semibold text-sm text-foreground">{row.season}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {row.from} – {row.to}
                      </p>
                    </div>
                    <div className="px-4 py-4 flex items-center">
                      <span className="font-semibold text-primary text-sm">{row.perNight}</span>
                    </div>
                    <div className="px-4 py-4 flex items-center">
                      <span className="text-sm text-foreground">{row.weekendNight}</span>
                    </div>
                    <div className="px-4 py-4 flex items-center">
                      <span className="text-sm text-foreground">{row.weekly}</span>
                    </div>
                    <div className="px-4 py-4 flex items-center">
                      <span className="text-sm text-muted-foreground">{row.monthly}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fees Table */}
            <div className="reveal reveal-delay-100 mb-10">
              <h3 className="font-display text-xl font-medium text-foreground mb-5">
                Taxes & Fees
              </h3>
              <div className="rounded-2xl border border-border overflow-hidden card-shadow">
                <div className="bg-muted grid grid-cols-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  <div className="px-5 py-4">Fee Type</div>
                  <div className="px-4 py-4">Rate</div>
                  <div className="px-4 py-4">Applied To</div>
                </div>
                {feeRows.map((fee, i) => (
                  <div key={i} className="rate-row grid grid-cols-3 border-t border-border">
                    <div className="px-5 py-4">
                      <p className="font-semibold text-sm text-foreground">{fee.label}</p>
                    </div>
                    <div className="px-4 py-4">
                      <span className="font-bold text-accent text-sm">{fee.value}</span>
                    </div>
                    <div className="px-4 py-4">
                      <span className="text-sm text-muted-foreground">{fee.note}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar: Instant Quote */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 reveal reveal-delay-200">
              <div className="bg-card border border-border rounded-2xl p-7 card-shadow">
                <h3 className="font-display text-xl font-medium text-foreground mb-1">
                  Instant Quote
                </h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Select your dates for an accurate rate estimate.
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground block mb-2">
                      Check-In
                    </label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full border border-input rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary transition-colors bg-background"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground block mb-2">
                      Check-Out
                    </label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full border border-input rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary transition-colors bg-background"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={computeEstimate}
                    className="btn-primary w-full text-center flex items-center justify-center gap-2 mt-2"
                  >
                    Get Quote
                    <Icon name="CalculatorIcon" size={16} />
                  </button>
                </div>

                {/* Estimate / Action */}
                <div className="mt-6 pt-6 border-t border-border">
                  {estimate ? (
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Nights</span>
                        <span className="font-semibold">{estimate.nights}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Subtotal</span>
                        <span className="font-semibold">
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                          }).format(estimate.subtotal)}
                        </span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Government Tax</span>
                        <span className="font-semibold">
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                          }).format(estimate.tax)}
                        </span>
                      </div>
                      <div className="flex justify-between mb-4">
                        <span className="text-sm text-muted-foreground">Service Fee</span>
                        <span className="font-semibold">
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                          }).format(estimate.service)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-semibold">Estimated Total</span>
                        <span className="text-xl font-bold">
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                          }).format(estimate.total)}
                        </span>
                      </div>
                      <div className="flex gap-3">
                        <a
                          href={`/book-now?checkIn=${checkIn}&checkOut=${checkOut}`}
                          className="btn-primary flex-1 inline-flex items-center justify-center gap-2 py-3"
                        >
                          Book Now
                        </a>
                        <button
                          onClick={() => setEstimate(null)}
                          className="btn-outline flex-1 py-3"
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  ) : (
                    <a
                      href="/book-now"
                      className="w-full btn-primary inline-flex items-center justify-center gap-2 py-3 text-sm"
                    >
                      Book Now
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
