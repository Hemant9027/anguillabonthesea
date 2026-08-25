"use client";

import React, { useState } from "react";
import Icon from "@/components/ui/AppIcon";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

type DayStatus = "available" | "booked" | "arrival" | "departure" | null;

const mockBookings: Record<string, DayStatus> = {
  "2026-08-10": "arrival",
  "2026-08-11": "booked",
  "2026-08-12": "booked",
  "2026-08-13": "booked",
  "2026-08-17": "departure",
  "2026-08-22": "arrival",
  "2026-08-23": "booked",
  "2026-08-24": "booked",
  "2026-08-25": "departure",
};

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function AvailabilityCalendar() {
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());

  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfMonth(calYear, calMonth);

  const prevMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear((y) => y - 1);
    } else setCalMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear((y) => y + 1);
    } else setCalMonth((m) => m + 1);
  };

  const getDayStatus = (day: number): DayStatus => {
    const key = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return mockBookings[key] ?? null;
  };

  return (
    <section className="bg-background py-16 px-6 md:px-16 pb-20">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Calendar */}
          <div className="lg:col-span-7">
            <h2 className="font-display text-2xl font-medium text-foreground mb-8">
              Availability Calendar
            </h2>
            <div className="bg-card border border-border rounded-2xl overflow-hidden card-shadow">
              {/* Month Nav */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-border">
                <button
                  onClick={prevMonth}
                  className="w-9 h-9 rounded-full border border-border hover:bg-muted flex items-center justify-center transition-colors"
                  aria-label="Previous month"
                >
                  <Icon name="ChevronLeftIcon" size={16} />
                </button>
                <span className="font-semibold text-foreground">
                  {MONTHS[calMonth]} {calYear}
                </span>
                <button
                  onClick={nextMonth}
                  className="w-9 h-9 rounded-full border border-border hover:bg-muted flex items-center justify-center transition-colors"
                  aria-label="Next month"
                >
                  <Icon name="ChevronRightIcon" size={16} />
                </button>
              </div>

              {/* Days Header */}
              <div className="grid grid-cols-7 border-b border-border">
                {DAYS_OF_WEEK.map((d) => (
                  <div
                    key={d}
                    className="py-3 text-center text-xs font-bold text-muted-foreground uppercase tracking-widest"
                  >
                    {d}
                  </div>
                ))}
              </div>

              {/* Day Grid */}
              <div className="grid grid-cols-7">
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="aspect-square border-r border-b border-border/50"
                  />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const status = getDayStatus(day);
                  const isToday =
                    day === today.getDate() &&
                    calMonth === today.getMonth() &&
                    calYear === today.getFullYear();
                  return (
                    <div
                      key={day}
                      className={`aspect-square flex items-center justify-center text-sm border-r border-b border-border/50 transition-colors relative
                        ${status === "booked" ? "cal-day-booked" : ""}
                        ${status === "available" ? "cal-day-available" : ""}
                        ${status === "arrival" ? "bg-primary/15 text-primary" : ""}
                        ${status === "departure" ? "bg-accent/15 text-accent" : ""}
                        ${isToday ? "ring-2 ring-inset ring-primary" : ""}
                        ${!status ? "hover:bg-muted cursor-pointer" : "cursor-default"}
                      `}
                    >
                      <span
                        className={`font-medium ${isToday ? "text-primary" : !status ? "text-foreground" : ""}`}
                      >
                        {day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <h3 className="font-display text-xl font-medium text-foreground">
              Calendar Key
            </h3>
            <div className="space-y-3">
              {[
                {
                  color: "bg-background border border-border",
                  label: "Available",
                  desc: "Open for booking",
                },
                {
                  color: "bg-primary/15",
                  label: "Arrival Day",
                  desc: "Check-in date",
                },
                {
                  color: "cal-day-booked",
                  label: "Booked",
                  desc: "Occupied / not available",
                },
                {
                  color: "bg-accent/15",
                  label: "Departure Day",
                  desc: "Check-out date",
                },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <div
                    className={`w-8 h-8 rounded-lg ${item.color} flex-shrink-0`}
                  />
                  <div>
                    <p className="font-semibold text-sm text-foreground">
                      {item.label}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-primary/5 border border-primary/15 rounded-2xl p-6 mt-2">
              <p className="text-sm text-foreground font-semibold mb-2">
                Need a specific date?
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Contact us directly for real-time availability and personalized
                quotes for your preferred dates.
              </p>
              <a
                href="mailto:anguillabonthesea@gmail.com"
                className="btn-primary text-sm inline-flex items-center gap-2"
              >
                <Icon name="EnvelopeIcon" size={15} />
                Email Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
