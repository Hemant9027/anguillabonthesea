"use client";

import React, { useState } from "react";
import {
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Booking } from "@/lib/types/booking";

interface CancelConfirmModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (bookingId: string, reason?: string) => Promise<void>;
}

export default function CancelConfirmModal({
  booking,
  isOpen,
  onClose,
  onConfirm,
}: CancelConfirmModalProps) {
  const [reason, setReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  if (!isOpen || !booking) return null;

  const handleConfirm = async () => {
    if (isCancelling) return;
    setIsCancelling(true);
    try {
      await onConfirm(booking._id, reason.trim());
      setReason("");
      onClose();
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        role="button"
        tabIndex={0}
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
        aria-label="Close dialog"
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl border border-[#E7E5E4] shadow-2xl p-6 overflow-hidden">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <ExclamationTriangleIcon className="w-6 h-6" />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#78716C] hover:text-[#1C1917] hover:bg-[#F4EFE9]"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <h3 className="font-serif text-lg font-bold text-[#1C1917] mb-2">
          Cancel Reservation {booking.bookingRef}?
        </h3>
        <p className="text-xs text-[#78716C] leading-relaxed mb-4">
          Are you sure you want to cancel the booking for{" "}
          <strong className="text-[#1C1917]">{booking.guestName}</strong> (
          {booking.checkIn} to {booking.checkOut})? The reservation will be
          marked as <strong className="text-red-600">Cancelled</strong> in the
          system and dates will be freed for new inquiries.
        </p>

        <div className="mb-5">
          <label className="block text-[11px] font-semibold text-[#44403C] mb-1">
            Cancellation Reason (optional note)
          </label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Guest requested refund, weather disruption..."
            className="w-full rounded-xl border border-[#D8D2C6] bg-[#FDFBF7]/60 px-3 py-2 text-xs text-[#1C1917] focus:bg-white focus:border-[#C88A4B] focus:ring-2 focus:ring-[#C88A4B]/20 outline-none transition-all"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F4EFE9]">
          <button
            type="button"
            onClick={onClose}
            disabled={isCancelling}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#78716C] hover:text-[#1C1917] hover:bg-[#F4EFE9] transition-colors"
          >
            Keep Booking
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isCancelling}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-all shadow-md disabled:opacity-50 cursor-pointer"
          >
            {isCancelling ? "Cancelling..." : "Confirm Cancellation"}
          </button>
        </div>
      </div>
    </div>
  );
}
