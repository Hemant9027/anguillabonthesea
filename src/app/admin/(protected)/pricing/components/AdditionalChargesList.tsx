"use client";

import React from "react";
import {
  TagIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { AdditionalCharge, ChargeType } from "@/lib/types/pricing";

interface AdditionalChargesListProps {
  charges: AdditionalCharge[];
  onAddCharge: () => void;
  onEditCharge: (charge: AdditionalCharge) => void;
  onDeleteCharge: (id: string, name: string) => void;
  onToggleActive: (charge: AdditionalCharge) => void;
  isLoading?: boolean;
}

export default function AdditionalChargesList({
  charges,
  onAddCharge,
  onEditCharge,
  onDeleteCharge,
  onToggleActive,
  isLoading,
}: AdditionalChargesListProps) {
  const getChargeTypeBadge = (type: ChargeType, amount: number) => {
    switch (type) {
      case "percentage":
        return {
          label: `${amount}% of Subtotal`,
          color: "bg-blue-50 text-blue-700 border-blue-200",
        };
      case "fixed":
        return {
          label: `$${amount} Flat Fee`,
          color: "bg-purple-50 text-purple-700 border-purple-200",
        };
      case "per_night":
        return {
          label: `$${amount} / Night`,
          color: "bg-emerald-50 text-emerald-700 border-emerald-200",
        };
      case "per_guest":
        return {
          label: `$${amount} / Guest`,
          color: "bg-amber-50 text-amber-800 border-amber-200",
        };
      default:
        return {
          label: `$${amount}`,
          color: "bg-stone-100 text-stone-700",
        };
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl border border-[#E7E5E4] p-6 shadow-sm animate-pulse space-y-4">
        <div className="h-6 bg-[#F4EFE9] rounded w-1/4" />
        <div className="h-20 bg-[#F4EFE9] rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-[#E7E5E4] p-6 sm:p-7 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F4EFE9]">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#C88A4B] block">
            Taxes & Fees
          </span>
          <h3 className="font-serif text-lg font-bold text-[#1C1917]">
            Additional Charges & Taxes
          </h3>
          <p className="text-xs text-[#78716C]">
            Mandatory island levies, cleaning fees, and service charges applied at checkout
          </p>
        </div>

        <button
          type="button"
          onClick={onAddCharge}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1C1917] hover:bg-[#2B2623] text-white text-xs font-semibold transition-all shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <PlusIcon className="w-4 h-4 text-[#C88A4B]" />
          <span>Add Charge</span>
        </button>
      </div>

      {/* Grid of Charge Cards */}
      {charges.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {charges.map((charge) => {
            const badge = getChargeTypeBadge(charge.type, charge.amount);

            return (
              <div
                key={charge._id}
                className="p-4 rounded-2xl border border-[#E7E5E4] bg-[#FDFBF7] flex flex-col justify-between hover:border-[#C88A4B] transition-all space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${badge.color}`}
                    >
                      {badge.label}
                    </span>

                    <button
                      type="button"
                      onClick={() => onToggleActive(charge)}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                        charge.isActive
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-stone-200 text-stone-600"
                      }`}
                    >
                      {charge.isActive ? "Active" : "Disabled"}
                    </button>
                  </div>

                  <h4 className="font-semibold text-sm text-[#1C1917]">
                    {charge.name}
                  </h4>
                  {charge.description && (
                    <p className="text-xs text-[#78716C] mt-0.5 leading-snug">
                      {charge.description}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-[#E7E5E4] flex items-center justify-between text-xs">
                  <span className="font-serif font-bold text-sm text-[#1C1917]">
                    {charge.type === "percentage"
                      ? `${charge.amount}%`
                      : `$${charge.amount}`}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onEditCharge(charge)}
                      className="p-1.5 rounded-lg text-[#78716C] hover:text-[#C88A4B] hover:bg-[#F4EFE9]"
                      title="Edit Charge"
                    >
                      <PencilSquareIcon className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteCharge(charge._id, charge.name)}
                      className="p-1.5 rounded-lg text-[#78716C] hover:text-red-600 hover:bg-red-50"
                      title="Delete Charge"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-8 px-4 rounded-2xl bg-[#FDFBF7] border border-dashed border-[#E7E5E4] text-center">
          <p className="text-xs text-[#78716C]">
            No additional charges or taxes configured yet.
          </p>
        </div>
      )}
    </div>
  );
}
