"use client";

import React, { useState, useEffect } from "react";
import {
  XMarkIcon,
  ExclamationCircleIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import {
  Booking,
  BookingStatus,
  PaymentStatus,
  CreateBookingDto,
} from "@/lib/types/booking";

interface BookingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: CreateBookingDto) => Promise<void>;
  initialBooking?: Booking | null;
}

export default function BookingFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialBooking,
}: BookingFormModalProps) {
  const isEditing = !!initialBooking;

  const [guestName, setGuestName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [accommodation, setAccommodation] = useState("Villa B on the Sea (Full Villa)");
  const [amount, setAmount] = useState(3500);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("pending");
  const [status, setStatus] = useState<BookingStatus>("pending");
  const [notes, setNotes] = useState("");

  const [nights, setNights] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Populate fields when modal opens or initialBooking changes
  useEffect(() => {
    if (initialBooking) {
      setGuestName(initialBooking.guestName || "");
      setEmail(initialBooking.email || "");
      setPhone(initialBooking.phone || "");
      setCheckIn(initialBooking.checkIn || "");
      setCheckOut(initialBooking.checkOut || "");
      setGuests(initialBooking.guests || 2);
      setAccommodation(initialBooking.accommodation || "Villa B on the Sea (Full Villa)");
      setAmount(initialBooking.amount || 0);
      setPaymentStatus(initialBooking.paymentStatus || "pending");
      setStatus(initialBooking.status || "pending");
      setNotes(initialBooking.notes || "");
    } else {
      // Default to next week for new booking
      const today = new Date();
      const inDate = new Date();
      inDate.setDate(today.getDate() + 7);
      const outDate = new Date();
      outDate.setDate(today.getDate() + 12);

      const inStr = inDate.toISOString().split("T")[0];
      const outStr = outDate.toISOString().split("T")[0];

      setGuestName("");
      setEmail("");
      setPhone("");
      setCheckIn(inStr);
      setCheckOut(outStr);
      setGuests(4);
      setAccommodation("Villa B on the Sea (Full Villa)");
      setAmount(4500);
      setPaymentStatus("pending");
      setStatus("confirmed");
      setNotes("");
    }
    setErrorMessage(null);
  }, [initialBooking, isOpen]);

  // Recalculate nights when dates change
  useEffect(() => {
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end > start) {
        const diffDays = Math.ceil(
          Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
        );
        setNights(diffDays);
      } else {
        setNights(0);
      }
    }
  }, [checkIn, checkOut]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Client-side validations
    if (!guestName.trim()) {
      setErrorMessage("Guest full name is required.");
      return;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage("A valid email address is required.");
      return;
    }

    if (!phone.trim()) {
      setErrorMessage("A contact phone number is required.");
      return;
    }

    if (!checkIn || !checkOut) {
      setErrorMessage("Both check-in and check-out dates are required.");
      return;
    }

    if (checkOut <= checkIn) {
      setErrorMessage("Check-out date must be strictly after check-in date.");
      return;
    }

    if (guests < 1) {
      setErrorMessage("Number of guests must be at least 1.");
      return;
    }

    if (amount < 0) {
      setErrorMessage("Total booking amount cannot be negative.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await onSubmit({
        guestName: guestName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        checkIn,
        checkOut,
        guests: Number(guests),
        accommodation,
        amount: Number(amount),
        paymentStatus,
        status,
        notes: notes.trim(),
      });
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || "An unexpected error occurred while saving.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        role="button"
        tabIndex={0}
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
        aria-label="Close modal"
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-2xl bg-white rounded-3xl border border-[#E7E5E4] shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-[#E7E5E4] bg-[#FDFBF7] flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#1C1917]">
              {isEditing ? `Edit Booking: ${initialBooking?.bookingRef}` : "Create New Booking"}
            </h3>
            <p className="text-xs text-[#78716C]">
              {isEditing
                ? "Update reservation information and guest details"
                : "Record a manual or direct concierge reservation"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-[#78716C] hover:text-[#1C1917] hover:bg-[#F4EFE9] transition-colors focus:outline-none"
            aria-label="Close dialog"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5" noValidate>
          {/* Error Banner */}
          {errorMessage && (
            <div
              role="alert"
              className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5"
            >
              <ExclamationCircleIcon className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
              <span className="font-medium leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {/* Section 1: Guest Details */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-3 flex items-center gap-1.5">
              <UserIcon className="w-4 h-4 text-[#C88A4B]" />
              <span>Guest Details</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <label className="block text-[11px] font-semibold text-[#44403C] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="e.g. Eleanor Vance"
                  className="w-full rounded-xl border border-[#D8D2C6] bg-[#FDFBF7]/60 px-3 py-2 text-xs text-[#1C1917] focus:bg-white focus:border-[#C88A4B] focus:ring-2 focus:ring-[#C88A4B]/20 outline-none transition-all"
                />
              </div>

              <div className="sm:col-span-1">
                <label className="block text-[11px] font-semibold text-[#44403C] mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="guest@example.com"
                  className="w-full rounded-xl border border-[#D8D2C6] bg-[#FDFBF7]/60 px-3 py-2 text-xs text-[#1C1917] focus:bg-white focus:border-[#C88A4B] focus:ring-2 focus:ring-[#C88A4B]/20 outline-none transition-all"
                />
              </div>

              <div className="sm:col-span-1">
                <label className="block text-[11px] font-semibold text-[#44403C] mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (264) 555-0199"
                  className="w-full rounded-xl border border-[#D8D2C6] bg-[#FDFBF7]/60 px-3 py-2 text-xs text-[#1C1917] focus:bg-white focus:border-[#C88A4B] focus:ring-2 focus:ring-[#C88A4B]/20 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Dates & Accommodation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-3 flex items-center gap-1.5">
              <CalendarDaysIcon className="w-4 h-4 text-[#C88A4B]" />
              <span>Dates & Occupancy</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#44403C] mb-1">
                  Check-In Date *
                </label>
                <input
                  type="date"
                  required
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full rounded-xl border border-[#D8D2C6] bg-[#FDFBF7]/60 px-3 py-2 text-xs text-[#1C1917] focus:bg-white focus:border-[#C88A4B] focus:ring-2 focus:ring-[#C88A4B]/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#44403C] mb-1">
                  Check-Out Date *
                </label>
                <input
                  type="date"
                  required
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full rounded-xl border border-[#D8D2C6] bg-[#FDFBF7]/60 px-3 py-2 text-xs text-[#1C1917] focus:bg-white focus:border-[#C88A4B] focus:ring-2 focus:ring-[#C88A4B]/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#44403C] mb-1">
                  Calculated Nights
                </label>
                <div className="w-full rounded-xl border border-[#E7E5E4] bg-[#F4EFE9] px-3 py-2 text-xs font-semibold text-[#1C1917]">
                  {nights > 0 ? `${nights} Nights` : "Invalid dates"}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#44403C] mb-1">
                  Guests Count
                </label>
                <input
                  type="number"
                  min="1"
                  max="14"
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value, 10) || 1)}
                  className="w-full rounded-xl border border-[#D8D2C6] bg-[#FDFBF7]/60 px-3 py-2 text-xs text-[#1C1917] focus:bg-white focus:border-[#C88A4B] focus:ring-2 focus:ring-[#C88A4B]/20 outline-none transition-all"
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-[11px] font-semibold text-[#44403C] mb-1">
                Villa / Accommodation Selection
              </label>
              <select
                value={accommodation}
                onChange={(e) => setAccommodation(e.target.value)}
                className="w-full rounded-xl border border-[#D8D2C6] bg-[#FDFBF7]/60 px-3 py-2 text-xs font-medium text-[#1C1917] focus:bg-white focus:border-[#C88A4B] focus:ring-2 focus:ring-[#C88A4B]/20 outline-none transition-all cursor-pointer"
              >
                <option value="Villa B on the Sea (Full Villa)">
                  Villa B on the Sea (Full 5-Bedroom Estate)
                </option>
                <option value="Villa B - East Wing Only">
                  Villa B - East Wing Suites (3 Bedrooms)
                </option>
                <option value="Villa B - West Wing Only">
                  Villa B - West Wing Suites (2 Bedrooms)
                </option>
              </select>
            </div>
          </div>

          {/* Section 3: Financial & Status */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-3 flex items-center gap-1.5">
              <CurrencyDollarIcon className="w-4 h-4 text-[#C88A4B]" />
              <span>Pricing & Status</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#44403C] mb-1">
                  Total Amount (USD) *
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-[#78716C]">
                    $
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    required
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                    className="w-full rounded-xl border border-[#D8D2C6] bg-[#FDFBF7]/60 pl-7 pr-3 py-2 text-xs font-semibold text-[#1C1917] focus:bg-white focus:border-[#C88A4B] focus:ring-2 focus:ring-[#C88A4B]/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#44403C] mb-1">
                  Payment Status
                </label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                  className="w-full rounded-xl border border-[#D8D2C6] bg-[#FDFBF7]/60 px-3 py-2 text-xs font-medium text-[#1C1917] focus:bg-white focus:border-[#C88A4B] focus:ring-2 focus:ring-[#C88A4B]/20 outline-none transition-all cursor-pointer"
                >
                  <option value="pending">Pending</option>
                  <option value="partially_paid">Partially Paid</option>
                  <option value="paid">Paid (Full)</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#44403C] mb-1">
                  Booking Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as BookingStatus)}
                  className="w-full rounded-xl border border-[#D8D2C6] bg-[#FDFBF7]/60 px-3 py-2 text-xs font-semibold text-[#1C1917] focus:bg-white focus:border-[#C88A4B] focus:ring-2 focus:ring-[#C88A4B]/20 outline-none transition-all cursor-pointer"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Notes */}
          <div>
            <label className="block text-[11px] font-semibold text-[#44403C] mb-1">
              Internal Administrative Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Guest preferences, arrival logistics, special requests..."
              className="w-full rounded-xl border border-[#D8D2C6] bg-[#FDFBF7]/60 p-3 text-xs text-[#1C1917] placeholder-[#78716C] focus:bg-white focus:border-[#C88A4B] focus:ring-2 focus:ring-[#C88A4B]/20 outline-none transition-all"
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-[#E7E5E4] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#78716C] hover:text-[#1C1917] hover:bg-[#F4EFE9] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-[#1C1917] hover:bg-[#2B2623] text-white text-xs font-semibold transition-all shadow-md disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-3.5 w-3.5 text-[#C88A4B]"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Saving Booking...</span>
                </>
              ) : (
                <span>{isEditing ? "Update Booking" : "Create Booking"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
