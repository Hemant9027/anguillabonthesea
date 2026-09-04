"use client";

import React, { useState, useEffect } from "react";
import {
  XMarkIcon,
  ExclamationTriangleIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { BlockReason, CreateBlockDto } from "@/lib/types/availability";

interface BlockDatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dto: CreateBlockDto) => Promise<void>;
  prefilledStartDate?: string;
}

const BLOCK_REASONS: BlockReason[] = [
  "Maintenance",
  "Owner stay",
  "Renovation",
  "Private booking",
  "Seasonal closure",
  "Other",
];

export default function BlockDatesModal({
  isOpen,
  onClose,
  onSubmit,
  prefilledStartDate,
}: BlockDatesModalProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState<BlockReason>("Maintenance");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().split("T")[0];
      const start = prefilledStartDate || today;
      setStartDate(start);

      // Default end date to 3 days later
      const d = new Date(`${start}T00:00:00`);
      d.setDate(d.getDate() + 3);
      setEndDate(d.toISOString().split("T")[0]);

      setReason("Maintenance");
      setNotes("");
      setErrorMessage(null);
    }
  }, [isOpen, prefilledStartDate]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!startDate || !endDate) {
      setErrorMessage("Both start and end dates are required.");
      return;
    }

    if (endDate < startDate) {
      setErrorMessage("End date cannot precede start date.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await onSubmit({
        startDate,
        endDate,
        reason,
        notes: notes.trim(),
      });
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to block dates.");
    } finally {
      setIsSubmitting(false);
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

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl border border-[#E7E5E4] shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#F4EFE9]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-stone-100 text-[#1C1917] flex items-center justify-center">
              <LockClosedIcon className="w-5 h-5 text-[#C88A4B]" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                Block Villa Dates
              </h3>
              <p className="text-xs text-[#78716C]">
                Hold dates for maintenance, renovation, or owner use
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#78716C] hover:text-[#1C1917] hover:bg-[#F4EFE9]"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="pt-4 space-y-4" noValidate>
          {errorMessage && (
            <div
              role="alert"
              className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5"
            >
              <ExclamationTriangleIcon className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span className="font-medium leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {/* Dates row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#44403C] mb-1">
                Start Date *
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-xl border border-[#D8D2C6] bg-[#FDFBF7]/60 px-3 py-2 text-xs text-[#1C1917] focus:bg-white focus:border-[#C88A4B] focus:ring-2 focus:ring-[#C88A4B]/20 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#44403C] mb-1">
                End Date *
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-xl border border-[#D8D2C6] bg-[#FDFBF7]/60 px-3 py-2 text-xs text-[#1C1917] focus:bg-white focus:border-[#C88A4B] focus:ring-2 focus:ring-[#C88A4B]/20 outline-none transition-all"
              />
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-[11px] font-semibold text-[#44403C] mb-1">
              Block Reason *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as BlockReason)}
              className="w-full rounded-xl border border-[#D8D2C6] bg-[#FDFBF7]/60 px-3 py-2 text-xs font-semibold text-[#1C1917] focus:bg-white focus:border-[#C88A4B] focus:ring-2 focus:ring-[#C88A4B]/20 outline-none transition-all cursor-pointer"
            >
              {BLOCK_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[11px] font-semibold text-[#44403C] mb-1">
              Internal Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Pool filter replacement, annual deep clean..."
              className="w-full rounded-xl border border-[#D8D2C6] bg-[#FDFBF7]/60 p-3 text-xs text-[#1C1917] placeholder-[#78716C] focus:bg-white focus:border-[#C88A4B] focus:ring-2 focus:ring-[#C88A4B]/20 outline-none transition-all"
            />
          </div>

          {/* Confirmation Notice */}
          <div className="p-3 rounded-xl bg-[#FDFBF7] border border-[#E7E5E4] text-[11px] text-[#78716C] leading-snug">
            Blocking these dates will prevent new guest inquiries and mark the property as unavailable across the calendar until unblocked.
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#78716C] hover:text-[#1C1917] hover:bg-[#F4EFE9]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-[#1C1917] hover:bg-[#2B2623] text-white text-xs font-semibold transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Blocking Dates...</span>
              ) : (
                <span>Confirm & Block Dates</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
