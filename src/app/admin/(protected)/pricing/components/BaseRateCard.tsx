"use client";

import React, { useState } from "react";
import {
  CurrencyDollarIcon,
  PencilSquareIcon,
  ShieldCheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { BaseRateConfig } from "@/lib/types/pricing";

interface BaseRateCardProps {
  baseRate: BaseRateConfig | null;
  onUpdateBaseRate: (data: Partial<BaseRateConfig>) => Promise<void>;
  isLoading?: boolean;
}

export default function BaseRateCard({
  baseRate,
  onUpdateBaseRate,
  isLoading,
}: BaseRateCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [villaName, setVillaName] = useState("");
  const [nightlyRate, setNightlyRate] = useState(2500);
  const [minStay, setMinStay] = useState(3);
  const [currency, setCurrency] = useState("USD");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openEdit = () => {
    if (baseRate) {
      setVillaName(baseRate.villaName);
      setNightlyRate(baseRate.nightlyRate);
      setMinStay(baseRate.minStay);
      setCurrency(baseRate.currency);
    }
    setError(null);
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nightlyRate < 0) {
      setError("Nightly rate cannot be negative.");
      return;
    }
    if (minStay < 1) {
      setError("Minimum stay must be at least 1 night.");
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      await onUpdateBaseRate({
        villaName,
        nightlyRate: Number(nightlyRate),
        minStay: Number(minStay),
        currency,
      });
      setIsEditing(false);
    } catch (err: any) {
      setError(err?.message || "Failed to update base rate.");
    } finally {
      setIsSaving(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: baseRate?.currency || "USD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  if (isLoading || !baseRate) {
    return (
      <div className="bg-white rounded-3xl border border-[#E7E5E4] p-6 shadow-sm animate-pulse space-y-4">
        <div className="h-6 bg-[#F4EFE9] rounded w-1/3" />
        <div className="h-10 bg-[#F4EFE9] rounded w-1/2" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-[#E7E5E4] p-6 sm:p-7 shadow-sm flex flex-col justify-between relative overflow-hidden">
      {/* Ambient background accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 w-48 h-48 rounded-full bg-[#C88A4B]/10 blur-3xl"
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#F4EFE9] text-[#C88A4B] flex items-center justify-center">
              <CurrencyDollarIcon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C88A4B] block">
                Standard Baseline
              </span>
              <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                Base Nightly Pricing
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={openEdit}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E7E5E4] bg-[#FDFBF7] hover:bg-white text-xs font-semibold text-[#1C1917] hover:border-[#C88A4B] transition-all shadow-xs cursor-pointer"
          >
            <PencilSquareIcon className="w-3.5 h-3.5 text-[#C88A4B]" />
            <span>Edit Base Rate</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#E7E5E4]">
            <p className="text-[11px] font-semibold text-[#78716C] uppercase tracking-wider mb-1">
              Standard Rate
            </p>
            <p className="font-serif text-3xl font-bold text-[#1C1917]">
              {formatCurrency(baseRate.nightlyRate)}
            </p>
            <p className="text-[10px] text-[#78716C] mt-0.5">
              per night ({baseRate.currency})
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#E7E5E4]">
            <p className="text-[11px] font-semibold text-[#78716C] uppercase tracking-wider mb-1">
              Minimum Stay
            </p>
            <p className="font-serif text-3xl font-bold text-[#1C1917]">
              {baseRate.minStay} Nights
            </p>
            <p className="text-[10px] text-[#78716C] mt-0.5">
              standard booking rule
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#E7E5E4]">
            <p className="text-[11px] font-semibold text-[#78716C] uppercase tracking-wider mb-1">
              Applicable Villa
            </p>
            <p className="font-semibold text-sm text-[#1C1917] truncate mt-1">
              {baseRate.villaName}
            </p>
            <p className="text-[10px] text-[#78716C] mt-1 flex items-center gap-1">
              <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-600" />
              <span>Full estate access</span>
            </p>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            role="button"
            tabIndex={0}
            onClick={() => setIsEditing(false)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setIsEditing(false);
            }}
            aria-label="Close modal"
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />

          <div className="relative z-10 w-full max-w-md bg-white rounded-3xl border border-[#E7E5E4] shadow-2xl p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-[#F4EFE9]">
              <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                Edit Base Villa Pricing
              </h3>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="p-1.5 rounded-lg text-[#78716C] hover:text-[#1C1917] hover:bg-[#F4EFE9]"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="pt-4 space-y-4">
              {error && (
                <div
                  role="alert"
                  className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs"
                >
                  {error}
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-[#44403C] mb-1">
                  Villa / Property Name
                </label>
                <input
                  type="text"
                  required
                  value={villaName}
                  onChange={(e) => setVillaName(e.target.value)}
                  className="w-full rounded-xl border border-[#D8D2C6] bg-[#FDFBF7]/60 px-3 py-2 text-xs text-[#1C1917] focus:bg-white focus:border-[#C88A4B] focus:ring-2 focus:ring-[#C88A4B]/20 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#44403C] mb-1">
                    Nightly Rate (USD) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    required
                    value={nightlyRate}
                    onChange={(e) => setNightlyRate(parseFloat(e.target.value) || 0)}
                    className="w-full rounded-xl border border-[#D8D2C6] bg-[#FDFBF7]/60 px-3 py-2 text-xs text-[#1C1917] focus:bg-white focus:border-[#C88A4B] focus:ring-2 focus:ring-[#C88A4B]/20 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#44403C] mb-1">
                    Minimum Stay (Nights) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={minStay}
                    onChange={(e) => setMinStay(parseInt(e.target.value, 10) || 1)}
                    className="w-full rounded-xl border border-[#D8D2C6] bg-[#FDFBF7]/60 px-3 py-2 text-xs text-[#1C1917] focus:bg-white focus:border-[#C88A4B] focus:ring-2 focus:ring-[#C88A4B]/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#F4EFE9]">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#78716C] hover:text-[#1C1917]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl bg-[#1C1917] hover:bg-[#2B2623] text-white text-xs font-semibold transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Base Rate"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
