"use client";

import React, { useState, useEffect } from "react";
import {
  XMarkIcon,
  TagIcon,
  CurrencyDollarIcon,
  InformationCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { AdditionalCharge, CreateChargeDto, ChargeType } from "@/lib/types/pricing";

interface ChargeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateChargeDto) => Promise<void>;
  editingCharge?: AdditionalCharge | null;
}

export default function ChargeFormModal({
  isOpen,
  onClose,
  onSubmit,
  editingCharge,
}: ChargeFormModalProps) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(250);
  const [type, setType] = useState<ChargeType>("fixed");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingCharge) {
      setName(editingCharge.name);
      setAmount(editingCharge.amount);
      setType(editingCharge.type);
      setDescription(editingCharge.description || "");
      setIsActive(editingCharge.isActive);
    } else {
      setName("");
      setAmount(250);
      setType("fixed");
      setDescription("");
      setIsActive(true);
    }
    setError(null);
  }, [editingCharge, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please provide a name for this charge.");
      return;
    }
    if (amount < 0) {
      setError("Charge amount cannot be negative.");
      return;
    }
    if (type === "percentage" && amount > 100) {
      setError("Percentage fee cannot exceed 100%.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit({
        name: name.trim(),
        amount: Number(amount),
        type,
        description: description.trim() || undefined,
        isActive,
      });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save charge.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white rounded-3xl max-w-lg w-full border border-[#E7E5E4] shadow-2xl overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#F4EFE9] flex items-center justify-between bg-gradient-to-r from-stone-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F4EFE9] text-[#C88A4B] flex items-center justify-center">
              <TagIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                {editingCharge ? "Edit Charge / Fee" : "Add Additional Charge"}
              </h3>
              <p className="text-xs text-[#78716C]">
                {editingCharge
                  ? `Modifying ${editingCharge.name}`
                  : "Configure automatic taxes, cleaning, or per-guest surcharges"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-[#F4EFE9] transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-800 text-xs">
              <ExclamationCircleIcon className="w-4 h-4 mt-0.5 shrink-0 text-rose-500" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          {/* Charge Name */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Charge Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Deep Cleaning Fee, Tourism Levy"
              required
              className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#C88A4B] focus:bg-white text-stone-800 transition-colors"
            />
          </div>

          {/* Charge Type & Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Calculation Type <span className="text-rose-500">*</span>
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ChargeType)}
                className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#C88A4B] focus:bg-white text-stone-800 transition-colors"
              >
                <option value="fixed">Fixed (Flat Amount)</option>
                <option value="percentage">Percentage of Stay (%)</option>
                <option value="per_night">Per Night ($ / night)</option>
                <option value="per_guest">Per Guest ($ / person)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Amount ({type === "percentage" ? "%" : "USD"}{" "}) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 font-serif font-bold text-sm">
                  {type === "percentage" ? "%" : "$"}
                </span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  required
                  className="w-full pl-8 pr-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#C88A4B] focus:bg-white text-stone-800 font-semibold transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Type Helper Note */}
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 text-[11px] text-stone-600 flex items-center gap-2">
            <InformationCircleIcon className="w-4 h-4 text-[#C88A4B] shrink-0" />
            <span>
              {type === "fixed" && "Charged once per entire reservation regardless of length or guests."}
              {type === "percentage" && "Calculated dynamically based on total base + seasonal nights subtotal."}
              {type === "per_night" && "Multiplied by the total number of nights stayed."}
              {type === "per_guest" && "Multiplied by total guests registered on reservation."}
            </span>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Description / Note
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Mandatory sanitization and linen turnover post-checkout."
              className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#C88A4B] focus:bg-white text-stone-800 transition-colors resize-none"
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F4EFE9]/40 border border-[#E7E5E4]">
            <div>
              <p className="text-xs font-bold text-stone-800">Charge Active</p>
              <p className="text-[11px] text-stone-500">
                Turn off to exclude this charge without deleting it
              </p>
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
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#F4EFE9]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C88A4B] to-[#B07338] text-white text-xs font-bold shadow-md hover:shadow-lg disabled:opacity-50 transition-all cursor-pointer"
            >
              {isSubmitting
                ? "Saving..."
                : editingCharge
                ? "Update Charge"
                : "Add Charge"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
