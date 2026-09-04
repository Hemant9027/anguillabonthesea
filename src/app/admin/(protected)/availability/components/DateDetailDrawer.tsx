"use client";

import React from "react";
import Link from "next/link";
import {
  XMarkIcon,
  CalendarDaysIcon,
  UserIcon,
  LockClosedIcon,
  LockOpenIcon,
  PlusIcon,
  ArrowTopRightOnSquareIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { CalendarDay } from "@/lib/types/availability";

interface DateDetailDrawerProps {
  day: CalendarDay | null;
  onClose: () => void;
  onBlockDate: (date: string) => void;
  onUnblockClick: (blockId: string, reason: string, dates: string) => void;
}

export default function DateDetailDrawer({
  day,
  onClose,
  onBlockDate,
  onUnblockClick,
}: DateDetailDrawerProps) {
  if (!day) return null;

  // Format date nicely: e.g. "Saturday, October 10, 2026"
  const formattedFullDate = new Date(`${day.date}T00:00:00`).toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <>
      {/* Backdrop */}
      <div
        role="button"
        tabIndex={0}
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
        aria-label="Close date details"
        className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 transition-opacity"
      />

      {/* Slide-over Panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col justify-between overflow-y-auto transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div>
          <div className="p-6 border-b border-[#E7E5E4] bg-[#FDFBF7] flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                    day.status === "booked"
                      ? "bg-[#1C1917] text-white"
                      : day.status === "blocked"
                      ? "bg-stone-200 text-stone-800"
                      : day.status === "pending"
                      ? "bg-amber-100 text-amber-900"
                      : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  }`}
                >
                  {day.status}
                </span>
                {day.isToday && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C88A4B]">
                    &bull; Today
                  </span>
                )}
              </div>
              <h3 className="font-serif text-xl font-bold text-[#1C1917]">
                {formattedFullDate}
              </h3>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-[#78716C] hover:text-[#1C1917] hover:bg-[#F4EFE9] transition-colors focus:outline-none"
              aria-label="Close drawer"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-6 text-sm">
            {/* Case 1: Booked */}
            {day.status === "booked" && day.bookingDetails && (
              <div className="bg-[#FDFBF7] rounded-2xl border border-[#E7E5E4] p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-[#C88A4B]" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#44403C]">
                      Confirmed Reservation
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold bg-[#1C1917] text-white px-2 py-0.5 rounded">
                    {day.bookingDetails.bookingRef}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <p className="text-[#78716C]">Guest Name</p>
                    <p className="font-bold text-sm text-[#1C1917]">
                      {day.bookingDetails.guestName}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E7E5E4]">
                    <div>
                      <p className="text-[#78716C]">Check-In</p>
                      <p className="font-semibold text-[#1C1917]">
                        {day.bookingDetails.checkIn}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#78716C]">Check-Out</p>
                      <p className="font-semibold text-[#1C1917]">
                        {day.bookingDetails.checkOut}
                      </p>
                    </div>
                  </div>
                </div>

                <Link
                  href="/admin/bookings"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white border border-[#E7E5E4] text-xs font-semibold text-[#1C1917] hover:border-[#C88A4B] transition-all shadow-xs"
                >
                  <span>Manage in Bookings Section</span>
                  <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

            {/* Case 2: Pending */}
            {day.status === "pending" && day.bookingDetails && (
              <div className="bg-amber-50/60 rounded-2xl border border-amber-200 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ClockIcon className="w-5 h-5 text-amber-600" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-amber-900">
                      Pending Reservation Hold
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold bg-amber-800 text-white px-2 py-0.5 rounded">
                    {day.bookingDetails.bookingRef}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-amber-950">
                  <div>
                    <p className="text-amber-700">Guest Name</p>
                    <p className="font-bold text-sm text-[#1C1917]">
                      {day.bookingDetails.guestName}
                    </p>
                  </div>
                  <p className="text-[11px] text-amber-800">
                    Stay window: {day.bookingDetails.checkIn} &rarr;{" "}
                    {day.bookingDetails.checkOut}
                  </p>
                </div>

                <Link
                  href="/admin/bookings"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white border border-amber-300 text-xs font-semibold text-amber-950 hover:bg-amber-50 transition-all shadow-xs"
                >
                  <span>Confirm or Review in Bookings</span>
                  <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

            {/* Case 3: Blocked */}
            {day.status === "blocked" && day.blockDetails && (
              <div className="bg-stone-50 rounded-2xl border border-stone-200 p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <LockClosedIcon className="w-5 h-5 text-stone-600" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-stone-900">
                    Manual Blockout
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <p className="text-[#78716C]">Block Reason</p>
                    <p className="font-bold text-sm text-[#1C1917]">
                      {day.blockDetails.reason}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#78716C]">Blocked Window</p>
                    <p className="font-semibold text-[#1C1917]">
                      {day.blockDetails.startDate} &rarr;{" "}
                      {day.blockDetails.endDate}
                    </p>
                  </div>
                  {day.blockDetails.notes && (
                    <div className="pt-2 border-t border-stone-200">
                      <p className="text-[#78716C]">Notes</p>
                      <p className="text-xs text-[#44403C]">
                        {day.blockDetails.notes}
                      </p>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onUnblockClick(
                      day.blockDetails!.id,
                      day.blockDetails!.reason,
                      `${day.blockDetails!.startDate} to ${day.blockDetails!.endDate}`
                    )
                  }
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white border border-stone-300 hover:border-red-400 hover:bg-red-50 text-xs font-semibold text-red-600 transition-all shadow-xs cursor-pointer"
                >
                  <LockOpenIcon className="w-4 h-4" />
                  <span>Unblock These Dates</span>
                </button>
              </div>
            )}

            {/* Case 4: Available */}
            {day.status === "available" && (
              <div className="space-y-4">
                <div className="bg-emerald-50/60 rounded-2xl border border-emerald-200 p-4 text-xs text-emerald-950">
                  <p className="font-semibold mb-1">
                    Villa is Open on this Date
                  </p>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    No bookings or manual maintenance blocks are scheduled. Guests can reserve this period.
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={() => onBlockDate(day.date)}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#1C1917] hover:bg-[#2B2623] text-white text-xs font-semibold transition-all shadow-sm cursor-pointer"
                  >
                    <LockClosedIcon className="w-4 h-4 text-[#C88A4B]" />
                    <span>Block Dates Starting {day.date}</span>
                  </button>

                  <Link
                    href="/admin/bookings"
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[#E7E5E4] bg-white hover:bg-[#FDFBF7] text-xs font-semibold text-[#1C1917] transition-all shadow-xs"
                  >
                    <PlusIcon className="w-4 h-4 text-[#C88A4B]" />
                    <span>Create Reservation in Bookings</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-[#E7E5E4] bg-[#FDFBF7] text-center text-xs text-[#78716C]">
          Villa B on the Sea &bull; Availability Engine
        </div>
      </div>
    </>
  );
}
