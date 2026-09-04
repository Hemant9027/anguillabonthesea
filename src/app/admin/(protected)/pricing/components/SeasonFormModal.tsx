"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  XMarkIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  InformationCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { SeasonalRule, CreateSeasonDto } from "@/lib/types/pricing";

interface SeasonFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSeasonDto) => Promise<void>;
  editingSeason?: SeasonalRule | null;
}

export default function SeasonFormModal({
  isOpen,
  onClose,
  onSubmit,
  editingSeason,
}: SeasonFormModalProps) {
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [nightlyRate, setNightlyRate] = useState(3200);
  const [minStay, setMinStay] = useState(5);
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (editingSeason) {
      setName(editingSeason.name);
      setStartDate(editingSeason.startDate);
      setEndDate(editingSeason.endDate);
      setNightlyRate(editingSeason.nightlyRate);
      setMinStay(editingSeason.minStay);
      setDescription(editingSeason.description || "");
      setIsActive(editingSeason.isActive);
    } else {
      // Default future dates
      const now = new Date();
      const in30 = new Date(now.getTime() + 30 * 86400000);
      const in45 = new Date(now.getTime() + 45 * 86400000);

      setName("");
      setStartDate(in30.toISOString().split("T")[0]);
      setEndDate(in45.toISOString().split("T")[0]);
      setNightlyRate(3200);
      setMinStay(5);
      setDescription("");
      setIsActive(true);
    }
    setError(null);
  }, [editingSeason, isOpen]);

  if (!isOpen || !mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please provide a name for this season.");
      return;
    }
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }
    if (endDate <= startDate) {
      setError("End date must be strictly after start date.");
      return;
    }
    if (nightlyRate <= 0) {
      setError("Nightly rate must be greater than $0.");
      return;
    }
    if (minStay < 1) {
      setError("Minimum stay must be at least 1 night.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit({
        name: name.trim(),
        startDate,
        endDate,
        nightlyRate: Number(nightlyRate),
        minStay: Number(minStay),
        description: description.trim() || undefined,
        isActive,
      });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save seasonal rule.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white rounded-3xl max-w-xl w-full border border-[#E7E5E4] shadow-2xl overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#F4EFE9] flex items-center justify-between bg-gradient-to-r from-stone-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F4EFE9] text-[#C88A4B] flex items-center justify-center shrink-0">
              <CalendarDaysIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                {editingSeason ? "Edit Seasonal Rate" : "Add Seasonal Pricing Rule"}
              </h3>
              <p className="text-xs text-[#78716C]">
                {editingSeason
                  ? `Modifying tier for ${editingSeason.name}`
                  : "Define special rates for peak seasons, holidays, or promotional dates"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full border border-stone-200 flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-[#F4EFE9] transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-800 text-xs">
              <ExclamationCircleIcon className="w-4 h-4 mt-0.5 shrink-0 text-rose-500" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          {/* Season Name */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Season Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Festive Holiday Season 2026-2027"
              required
              className="w-full px-4 py-2.5 rounded-2xl border border-stone-200 bg-stone-50/50 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#C88A4B]/20 focus:border-[#C88A4B] transition-all"
            />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Start Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-2xl border border-stone-200 bg-stone-50/50 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#C88A4B]/20 focus:border-[#C88A4B] transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                End Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-2xl border border-stone-200 bg-stone-50/50 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#C88A4B]/20 focus:border-[#C88A4B] transition-all"
              />
            </div>
          </div>

          {/* Rates & Min Stay */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Nightly Rate (USD) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 font-serif font-bold text-sm">
                  $
                </span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={nightlyRate}
                  onChange={(e) => setNightlyRate(Number(e.target.value))}
                  required
                  className="w-full pl-8 pr-4 py-2.5 rounded-2xl border border-stone-200 bg-stone-50/50 text-xs text-stone-800 font-semibold focus:outline-none focus:ring-2 focus:ring-[#C88A4B]/20 focus:border-[#C88A4B] transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Min. Stay (Nights) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={minStay}
                onChange={(e) => setMinStay(Number(e.target.value))}
                required
                className="w-full px-4 py-2.5 rounded-2xl border border-stone-200 bg-stone-50/50 text-xs text-stone-800 font-semibold focus:outline-none focus:ring-2 focus:ring-[#C88A4B]/20 focus:border-[#C88A4B] transition-all"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Description / Internal Notes <span className="text-stone-400 font-normal lowercase">(optional)</span>
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Applies to Thanksgiving and Christmas window; requires full non-refundable deposit."
              className="w-full px-4 py-2.5 rounded-2xl border border-stone-200 bg-stone-50/50 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#C88A4B]/20 focus:border-[#C88A4B] transition-all resize-none"
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50/80 border border-stone-200/80">
            <div className="flex items-center gap-2.5">
              <InformationCircleIcon className="w-5 h-5 text-[#C88A4B]" />
              <div>
                <p className="text-xs font-bold text-stone-800">Rule Active</p>
                <p className="text-[11px] text-stone-500">
                  Inactive rules do not apply during quotes or calculations
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C88A4B]" />
            </label>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-[#C88A4B] hover:bg-[#B3783E] text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSubmitting
                ? "Saving..."
                : editingSeason
                ? "Update Seasonal Rule"
                : "Create Seasonal Rule"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
